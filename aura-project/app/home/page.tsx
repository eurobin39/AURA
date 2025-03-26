"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, BarChart2, Clock, ChevronRight, Trophy } from 'lucide-react';
import FocusCoach from '@/components/FocusCoach';

// Import the FocusInsight interface
interface FocusInsight {
  analysis: string;
  tips: string[];
  insight: string;
}

export default function Dashboard() {
  const [latestInsight, setLatestInsight] = useState<FocusInsight | undefined>(undefined);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    average: 0,
    best: 0
  });
  
  useEffect(() => {
    // Fetch latest insight and session stats
    const fetchData = async () => {
      try {
        const response = await fetch('/api/focus-sessions');
        
        if (response.ok) {
          const data = await response.json();
          const sessions = data.sessions || [];
          
          if (sessions.length > 0) {
            // Get most recent session with insights
            const recentSessionWithInsights = sessions.find((s: any) => s.insights);
            
            if (recentSessionWithInsights?.insights) {
              setLatestInsight(recentSessionWithInsights.insights);
            }
            
            // Calculate stats
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
  
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome to AURA</h1>
        <p className="text-gray-400 mt-2">Your AI-powered productivity assistant</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Your Focus Stats</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Total Sessions</span>
                </div>
                <span className="text-xl font-semibold text-white">{sessionStats.total}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                    <BarChart2 className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-gray-300">Average Focus</span>
                </div>
                <span className="text-xl font-semibold text-white">{sessionStats.average}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-500/20 rounded-lg mr-3">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  </div>
                  <span className="text-gray-300">Best Score</span>
                </div>
                <span className="text-xl font-semibold text-white">{sessionStats.best}%</span>
              </div>
            </div>
            
            <Link href="/home/focus-coach" className="flex items-center justify-center mt-6 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
              Start New Session
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Focus Coach Card */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-blue-700/30">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-500/30 rounded-full mr-3">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">AI Focus Coach</h2>
              </div>
              
              <FocusCoach insight={latestInsight} />
              
              <div className="mt-4 border-t border-gray-700 pt-4 flex justify-between items-center">
                <p className="text-gray-400">Get personalized productivity insights based on your work patterns</p>
                <Link 
                  href="/home/focus-coach"
                  className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Open Coach
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 