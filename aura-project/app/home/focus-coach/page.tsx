"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Play, Square, BarChart2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { startFaceAnalysis } from "@/lib/faceAPI";
import { startTracking } from "@/lib/tracker";

console.log("ENV ENDPOINT:", process.env.NEXT_PUBLIC_FACE_API_ENDPOINT);
console.log("ENV KEY:", process.env.NEXT_PUBLIC_FACE_API_KEY);

export default function FocusCoachPage() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const isSessionActiveRef = useRef(false); // 🔥 Ref 추가

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const cleanupRef = useRef<(() => void)[]>([]);

  // 🔁 isSessionActive가 바뀔 때 ref에도 반영
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
      console.log("[FocusCoach] Start session response:", sessionData);

      if (!sessionResponse.ok) {
        throw new Error(sessionData.error || "Failed to start session");
      }

      setIsSessionActive(true);
      setSessionStart(new Date());
      setElapsedTime(0);

      // ✅ Ref 버전으로 추적 시작
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
      console.log("[FocusCoach] End session response:", endData);

      if (!response.ok) {
        throw new Error(endData.error || "Failed to end session");
      }
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
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      <video ref={videoRef} autoPlay muted className="hidden" />
      <div className="p-10 flex-grow max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold">Focus Session</h1>
          <div className="flex items-center space-x-2 bg-blue-600/20 px-4 py-2 rounded-lg">
            <Sparkles className="text-blue-400" />
            <span className="text-sm font-medium text-blue-200">Live Mode</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold">🕒 Session Timer</h2>
            <div className="flex items-center justify-center bg-gray-700/40 p-4 rounded-lg">
              <Clock className="text-blue-400 mr-2" />
              <span className="text-2xl font-mono">{formatElapsedTime(elapsedTime)}</span>
            </div>
            <div className="flex justify-center mt-4">
              {!isSessionActive ? (
                <button
                  onClick={startSession}
                  className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg"
                >
                  <Play className="mr-2" size={18} /> Start Session
                </button>
              ) : (
                <button
                  onClick={endSession}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg"
                >
                  <Square className="mr-2" size={18} /> End Session
                </button>
              )}
            </div>
          </motion.div>

          <motion.div className="lg:col-span-2 space-y-8">
            <div className="bg-blue-900/40 p-6 rounded-2xl">
              <h2 className="text-xl font-semibold flex items-center">
                <BarChart2 className="text-blue-400 mr-2" /> Focus Analytics
              </h2>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Keyboard</div>
                  <div className="text-2xl text-blue-400">{focusData.keyboard}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Clicks</div>
                  <div className="text-2xl text-blue-400">{focusData.mouseClicks}</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Focus Score</div>
                  <div className="text-2xl text-blue-400">{focusData.focusScore}%</div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm text-gray-400">Face Focus</h3>
                <p>
                  Score: {faceData.focusScore}%, Yaw: {faceData.yaw.toFixed(1)}, Pitch:{" "}
                  {faceData.pitch.toFixed(1)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
