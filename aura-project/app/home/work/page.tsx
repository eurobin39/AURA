"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";
import { Heart, Home, Lock, BarChart2, ChevronRight } from "lucide-react";
import Link from "next/link";

const WorkEfficiencyPage = () => {
  const router = useRouter();
  const weeklyScoreChartRef = useRef<HTMLCanvasElement>(null);
  const [focusScore, setFocusScore] = useState(78);
  const [overallScore, setOverallScore] = useState(0);
  const [idlePeriods, setIdlePeriods] = useState(0);
  const [alertResponses, setAlertResponses] = useState(0);
  const [productiveZones, setProductiveZones] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          if (!data?.id) router.push('/login');
          else setIsAuthenticated(true);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchFocusData = async () => {
      try {
        const res = await fetch('/api/focus-insights');
        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid data format");

        const labels = data.map((entry: any) => new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }));
        const scores = data.map((entry: any) => entry.score);

        // KPIs
        const total = scores.reduce((sum: number, score: number) => sum + score, 0);
        const avg = total / scores.length;
        const idle = scores.filter((score: number) => score < 30).length;
        const alert = scores.filter((score: number) => score < 50).length;
        const productive = scores.filter((score: number) => score >= 70).length;

        setOverallScore(Math.round(avg));
        setIdlePeriods(idle);
        setAlertResponses(alert);
        setProductiveZones(productive);

        const ctx = weeklyScoreChartRef.current;
        if (!ctx) return;

        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Weekly Focus Score",
                data: scores,
                backgroundColor: "#60a5fa",
                borderRadius: 4,
                barThickness: 16,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { labels: { color: "#ffffff" } } },
            scales: {
              x: { ticks: { color: "#ffffff" } },
              y: {
                ticks: { color: "#ffffff" },
                beginAtZero: true,
                max: 100,
              },
            },
          },
        });
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchFocusData();
  }, []);

  const auraAnimationSpeed = 5 - Math.min(focusScore / 25, 4);

  if (isAuthenticated === null) return null;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-10 relative overflow-hidden flex flex-col">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: auraAnimationSpeed, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex-grow">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Work <span className="text-blue-500">Efficiency</span> Overview
          </h1>
          <div className="flex items-center space-x-2 bg-blue-600/20 px-4 py-2 rounded-lg shadow">
            <BarChart2 className="text-blue-400" />
            <span className="text-sm font-medium text-blue-200">Performance Insights</span>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 text-center shadow-xl">
            <Heart className="mx-auto text-blue-400 mb-1" />
            <p className="text-lg font-bold text-white">{overallScore}</p>
            <p className="text-sm text-gray-400">Overall Scores</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 text-center shadow-xl">
            <Home className="mx-auto text-blue-400 mb-1" />
            <p className="text-lg font-bold text-white">{idlePeriods}</p>
            <p className="text-sm text-gray-400">Idle Periods</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 text-center shadow-xl">
            <Lock className="mx-auto text-blue-400 mb-1" />
            <p className="text-lg font-bold text-white">{alertResponses}</p>
            <p className="text-sm text-gray-400">Alert Responses</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 text-center shadow-xl">
            <BarChart2 className="mx-auto text-blue-400 mb-1" />
            <p className="text-lg font-bold text-white">{productiveZones}</p>
            <p className="text-sm text-gray-400">Productive Zones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl lg:col-span-2"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Weekly Focus Score</h2>
            <canvas ref={weeklyScoreChartRef} className="w-full h-56"></canvas>
            <p className="mt-4 text-gray-300 text-sm">Your focus scores over the past week.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-700/30 backdrop-blur-lg p-6 rounded-2xl shadow-xl flex flex-col justify-center space-y-4"
          >
            <h2 className="text-xl font-semibold text-white">Detailed Insights</h2>
            <p className="text-gray-300 text-sm text-center">Explore more detailed data below.</p>
            <Link href="/dashboard/faceAPI" className="w-full">
              <button className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white font-semibold rounded-lg shadow-md hover:from-blue-600/80 hover:to-indigo-600/80 transition-all duration-300">
                FaceAPI Data
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            <Link href="/dashboard/keyboard" className="w-full">
              <button className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white font-semibold rounded-lg shadow-md hover:from-teal-600/80 hover:to-cyan-600/80 transition-all duration-300">
                Keyboard/Mouse Data
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
          </motion.div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p className="opacity-60">✨ Optimize your workflow with AURA.</p>
        </footer>
      </div>
    </div>
  );
};

export default WorkEfficiencyPage;
