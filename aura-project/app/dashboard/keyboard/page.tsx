"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Keyboard, Mouse, Ruler, BarChart2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FocusLog {
  id: number;
  timestamp: string;
  keyboard: number;
  mouseClicks: number;
  mouseDistance: number;
  focusScore: number;
}

export default function FocusStatsPage() {
  const [logs, setLogs] = useState<FocusLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/focus-log", { cache: "no-store" });
        const data = await res.json();
        console.log("Fetched logs:", data);
        setLogs(data.reverse());
      } catch (err) {
        console.error("Failed to fetch focus logs:", err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, []);

  const latest = logs[logs.length - 1];
  const recentLogs = logs.slice(-5);
  const auraAnimationSpeed = 5 - Math.min((latest?.focusScore || 0) / 25, 4);

  const emptyData = [{ timestamp: new Date().toISOString(), keyboard: 0, mouseClicks: 0, mouseDistance: 0, focusScore: 0 }];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f172a] text-white flex flex-col p-10">
      {/* Background Aura Animation */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: auraAnimationSpeed, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: "radial-gradient(circle at center, rgba(59,130,246,0.2), transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex-grow">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/home/dopple">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 px-4 py-2 rounded-full shadow-md transition-colors duration-200"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Back</span>
              </motion.button>
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Focus Tracking Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-blue-800/20 px-4 py-1.5 rounded-full shadow-lg">
            <Sparkles className="text-blue-400" size={16} />
            <span className="text-xs font-medium text-blue-200">Live Analytics</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Keyboard Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-xl p-6 shadow-lg flex items-center space-x-6"
          >
            <div className="w-1/2 relative">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                <Keyboard className="text-blue-400 mr-2" size={20} /> Keyboard Inputs
              </h2>
              <ResponsiveContainer width="100%" height={160} minHeight={160}>
                <LineChart data={recentLogs.length > 0 ? recentLogs : emptyData}>
                  <XAxis dataKey="timestamp" stroke="#94a3b8" tick={false} height={10} />
                  <YAxis stroke="#94a3b8" hide />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", padding: "8px" }}
                  />
                  <Line type="monotone" dataKey="keyboard" stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              {recentLogs.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-medium">
                  No data yet
                </div>
              )}
            </div>
            <div className="w-1/2 text-right">
              <p className="text-sm text-gray-400 mb-1">Latest Activity</p>
              <p className="text-3xl font-bold text-blue-400">{latest?.keyboard || 0}</p>
            </div>
          </motion.div>

          {/* Mouse Clicks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-xl p-6 shadow-lg flex items-center space-x-6"
          >
            <div className="w-1/2 relative">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                <Mouse className="text-blue-400 mr-2" size={20} /> Mouse Clicks
              </h2>
              <ResponsiveContainer width="100%" height={160} minHeight={160}>
                <LineChart data={recentLogs.length > 0 ? recentLogs : emptyData}>
                  <XAxis dataKey="timestamp" stroke="#94a3b8" tick={false} height={10} />
                  <YAxis stroke="#94a3b8" hide />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", padding: "8px" }}
                  />
                  <Line type="monotone" dataKey="mouseClicks" stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              {recentLogs.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-medium">
                  No data yet
                </div>
              )}
            </div>
            <div className="w-1/2 text-right">
              <p className="text-sm text-gray-400 mb-1">Latest Activity</p>
              <p className="text-3xl font-bold text-blue-400">{latest?.mouseClicks || 0}</p>
            </div>
          </motion.div>

          {/* Mouse Distance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-xl p-6 shadow-lg flex items-center space-x-6"
          >
            <div className="w-1/2 relative">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                <Ruler className="text-blue-400 mr-2" size={20} /> Mouse Distance
              </h2>
              <ResponsiveContainer width="100%" height={160} minHeight={160}>
                <LineChart data={recentLogs.length > 0 ? recentLogs : emptyData}>
                  <XAxis dataKey="timestamp" stroke="#94a3b8" tick={false} height={10} />
                  <YAxis stroke="#94a3b8" hide />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", padding: "8px" }}
                  />
                  <Line type="monotone" dataKey="mouseDistance" stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              {recentLogs.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-medium">
                  No data yet
                </div>
              )}
            </div>
            <div className="w-1/2 text-right">
              <p className="text-sm text-gray-400 mb-1">Latest Activity</p>
              <p className="text-3xl font-bold text-blue-400">{latest?.mouseDistance || 0} px</p>
            </div>
          </motion.div>

          {/* Focus Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 rounded-xl p-6 shadow-lg flex items-center space-x-6"
          >
            <div className="w-1/2 relative">
              <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
                <BarChart2 className="text-blue-400 mr-2" size={20} /> Focus Score
              </h2>
              <ResponsiveContainer width="100%" height={160} minHeight={160}>
                <LineChart data={recentLogs.length > 0 ? recentLogs : emptyData}>
                  <XAxis dataKey="timestamp" stroke="#94a3b8" tick={false} height={10} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" hide />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                    contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", padding: "8px" }}
                  />
                  <Line type="monotone" dataKey="focusScore" stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              {recentLogs.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-medium">
                  No data yet
                </div>
              )}
            </div>
            <div className="w-1/2 text-right">
              <p className="text-sm text-gray-400 mb-1">Latest Score</p>
              <p className="text-3xl font-bold text-blue-400">{latest?.focusScore || 0} <span className="text-lg text-gray-400">/ 100</span></p>
              {latest && (
                <p className="text-sm text-gray-200 mt-1">
                  {latest.focusScore >= 60 ? "✅ Excellent" : "⚠ Needs Improvement"}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-400">
          <p className="opacity-80">✨ Track your focus, optimize your flow.</p>
        </footer>
      </div>
    </div>
  );
}