"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, BarChart2, Clock, ChevronRight, Trophy, Sparkles } from 'lucide-react';
import FocusCoach from '@/components/FocusCoach';

interface FocusInsight {
  analysis: string;
  tips: string[];
  insight: string;
}

export default function Dashboard() {
  const [latestInsight, setLatestInsight] = useState<FocusInsight | undefined>(undefined);
  const [sessionStats, setSessionStats] = useState({ total: 0, average: 0, best: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/focus-sessions');
        if (response.ok) {
          const data = await response.json();
          const sessions = data.sessions || [];
          if (sessions.length > 0) {
            const recentSessionWithInsights = sessions.find((s: any) => s.insights);
            if (recentSessionWithInsights?.insights) setLatestInsight(recentSessionWithInsights.insights);
            setSessionStats({
              total: sessions.length,
              average: Math.round(sessions.reduce((acc: number, s: any) => acc + (s.focusScore || 0), 0) / sessions.length),
              best: Math.max(...sessions.map((s: any) => s.focusScore || 0))
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const auraAnimationSpeed = 5 - Math.min(sessionStats.average / 25, 4);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f172a] text-white flex flex-col">
      {/* Radial Aura Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: auraAnimationSpeed, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative z-10 p-10 flex-grow">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Welcome to <span className="text-blue-500">AURA</span>
            </h1>
            <p className="text-gray-400 mt-1">Your AI-powered productivity assistant</p>
          </div>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2 bg-blue-600/20 px-4 py-2 rounded-lg shadow"
          >
            <Sparkles className="text-blue-400" />
            <span className="text-sm font-medium text-blue-200">Enhanced Dashboard Experience</span>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-25">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl space-y-6"
          >
            <h2 className="text-xl font-semibold">📊 Your Focus Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-700/40 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-400" />
                  <span>Total Sessions</span>
                </div>
                <span className="text-white font-bold text-lg">{sessionStats.total}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-700/40 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart2 className="text-green-400" />
                  <span>Average Focus</span>
                </div>
                <span className="text-green-300 font-bold text-lg">{sessionStats.average}%</span>
              </div>
              <div className="flex justify-between items-center bg-gray-700/40 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="text-yellow-400" />
                  <span>Best Score</span>
                </div>
                <span className="text-yellow-300 font-bold text-lg">{sessionStats.best}%</span>
              </div>
            </div>
            <Link
              href="/home/focus-coach"
              className="inline-flex items-center justify-center w-full mt-4 py-2 bg-gradient-to-r  from-blue-500/80 to-indigo-500/80 rounded-lg text-white font-semibold transition"
            >
              Start New Session <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-700/30 backdrop-blur-lg p-6 rounded-2xl shadow-2xl"
          >
            <div className="flex items-center mb-5">
              <div className="p-2 bg-blue-600/20 rounded-full mr-3">
                <Brain className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">AI Focus Coach</h2>
            </div>
            <FocusCoach insight={latestInsight} />
            <div className="mt-6 border-t border-gray-700 pt-4 flex justify-between items-center">
              <p className="text-gray-400">Get personalized productivity insights based on your work patterns</p>
              <Link
                href="/home/focus-coach"
                className="flex items-center text-blue-400 hover:text-blue-300"
              >
                Open Coach <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <footer className="mt-35 text-center text-sm text-gray-500">
          <p className="opacity-60">✨ Stay focused. Let AURA guide you.</p>
        </footer>
      </div>
    </div>
  );
}