"use client";

import { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  Square,
  BarChart2,
  Sparkles,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { startFaceAnalysis } from "@/lib/faceAPI";
import { startTracking } from "@/lib/tracker";
import Link from "next/link";

export default function FocusCoachPage() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const isSessionActiveRef = useRef(false);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [focusData, setFocusData] = useState({
    keyboard: 0,
    mouseClicks: 0,
    mouseDistance: 0,
    focusScore: 0,
  });
  const [faceData, setFaceData] = useState({
    focusScore: 0,
    yaw: 0,
    pitch: 0,
  });
  const [insightText, setInsightText] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cleanupRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    isSessionActiveRef.current = isSessionActive;
  }, [isSessionActive]);

  const startSession = async () => {
    try {
      const sessionResponse = await fetch("/api/focus-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const sessionData = await sessionResponse.json();
      if (!sessionResponse.ok) throw new Error(sessionData.error || "Failed to start session");

      setIsSessionActive(true);
      setSessionStart(new Date());
      setElapsedTime(0);
      setInsightText(null);
      cleanupRef.current.push(startTracking(setFocusData, isSessionActiveRef));
      cleanupRef.current.push(startFaceAnalysis(videoRef, setFaceData, isSessionActiveRef));
    } catch (error) {
      console.error("[FocusCoach] Error starting session:", error);
    }
  };

  const endSession = async () => {
    try {
      setIsSessionActive(false);
      setSessionStart(null);
      cleanupRef.current.forEach((cleanup) => cleanup());
      cleanupRef.current = [];

      const response = await fetch("/api/focus-sessions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const endData = await response.json();
      if (!response.ok) throw new Error(endData.error || "Failed to end session");
      if (endData.insights?.analysis) setInsightText(endData.insights.analysis);
    } catch (error) {
      console.error("[FocusCoach] Error ending session:", error);
    }
  };

  useEffect(() => {
    if (!isSessionActive || !sessionStart) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - sessionStart.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStart]);

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f172a] text-white flex flex-col">
      {/* Radial Aura Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 p-10 flex-grow">
        {/* 페이지 설명 섹션 */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <span className="text-blue-500">AURA</span> Focus Coach
            </h1>
            <p className="text-gray-400 mt-1">
              Track your focus in real-time with AI-powered insights
            </p>
          </div>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 bg-blue-600/20 px-4 py-2 rounded-lg shadow"
          >
            <Sparkles className="text-blue-400" />
            <span className="text-sm font-medium text-blue-200">
              Real-Time Focus Tracking
            </span>
          </motion.div>
        </header>

        {/* 메인 콘텐츠 */}
        <div className="max-w-6xl w-full space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {/* 왼쪽: 타이머 (위) + 카메라 (아래), 1/3 비율 */}
            <div className="col-span-1 flex flex-col gap-4">
              {/* 타이머 - 높이 증가 */}
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between min-h-[200px]">
                <h2 className="text-xl font-semibold mb-2">🕒 Elapsed Time</h2>
                <div className="flex flex-wrap justify-center items-center text-4xl font-mono tracking-wide text-blue-300 bg-gray-900 px-6 py-4 rounded-lg break-words">
                  {formatElapsedTime(elapsedTime)}
                </div>
                <button
                  onClick={isSessionActive ? endSession : startSession}
                  className={`mt-6 flex items-center justify-center px-6 py-3 rounded-lg transition font-medium ${
                    isSessionActive
                      ? "bg-red-300 hover:bg-red-400 text-black"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isSessionActive ? (
                    <>
                      <Square className="mr-2" size={18} /> End Session
                    </>
                  ) : (
                    <>
                      <Play className="mr-2" size={18} /> Start Session
                    </>
                  )}
                </button>
              </div>

              {/* 카메라 - 높이 증가 */}
              <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex justify-center items-center min-h-[330px]">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full max-w-sm h-full rounded-lg border border-blue-500 shadow"
                />
              </div>
            </div>

            {/* 오른쪽: AI Insight (위) + 데이터 (아래), 2/3 비율 */}
            <div className="col-span-2 flex flex-col gap-4">
              {/* AI Insight */}
              <div className="bg-gray-800 p-4 rounded-2xl shadow-lg min-h-[180px]">
                <h2 className="text-xl font-semibold flex items-center">
                  <BrainCircuit className="mr-2 text-yellow-400" /> AI Insight
                </h2>
                <div className="bg-gray-900 rounded-lg p-4 text-gray-300 whitespace-pre-line min-h-[120px]">
                  {insightText || "(Insight will be displayed here after session ends.)"}
                </div>
              </div>

              {/* 데이터: Mouse Activity + Face Analysis */}
              <div className="flex flex-col gap-4">
                <div className="bg-gray-800 p-4 rounded-2xl shadow-lg h-[180px] flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-300">🖱️ Mouse Activity</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Keyboard</div>
                      <div className="text-2xl text-blue-300 font-bold mt-1">{focusData.keyboard}</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Clicks</div>
                      <div className="text-2xl text-blue-300 font-bold mt-1">{focusData.mouseClicks}</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Mouse Distance</div>
                      <div className="text-2xl text-blue-300 font-bold mt-1">{focusData.mouseDistance}px</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Focus Score</div>
                      <div className="text-2xl text-green-400 font-bold mt-1">{focusData.focusScore}%</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-2xl shadow-lg h-[180px] flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-300">🧠 Face Analysis</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Yaw</div>
                      <div className="text-2xl text-purple-300 font-bold mt-1">{faceData.yaw.toFixed(1)}</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Pitch</div>
                      <div className="text-2xl text-purple-300 font-bold mt-1">{faceData.pitch.toFixed(1)}</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl text-center">
                      <div className="text-sm text-gray-400">Focus Score</div>
                      <div className="text-2xl text-green-400 font-bold mt-1">{faceData.focusScore}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-gray-500">
          <p className="opacity-60">✨ Monitor your focus. Let AURA optimize your productivity.</p>
        </footer>
      </div>
    </div>
  );
}