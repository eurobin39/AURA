"use client";

import { useState, useEffect } from 'react';
import { Clock, Play, Square, BarChart2, History, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import ActivityTracker from '@/components/ActivityTracker';
import FocusCoach from '@/components/FocusCoach';
import { useSessionStore } from '@/lib/session-store';

export default function FocusCoachPage() {
  const { 
    isSessionActive, 
    sessionStart, 
    setSessionActive, 
    setSessionStart, 
    setSessionId,
    resetSession 
  } = useSessionStore();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [latestInsight, setLatestInsight] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Start a new session

  const startSession = async () => {
    try {
      const response = await fetch('/api/focus-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionActive(true);
        setSessionStart(new Date());
        setSessionId(data.sessionId);
        setElapsedTime(0);
      } else {
        console.error('Failed to start session');
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const endSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/focus-sessions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLatestInsight(data.insights);
        resetSession();
        
        // Refresh history
        fetchSessionHistory();
      } else {
        console.error('Failed to end session');
      }
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSessionHistory = async () => {
    try {
      const response = await fetch('/api/focus-sessions');
      if (response.ok) {
        const data = await response.json();
        setSessionHistory(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching session history:', error);
    }
  };

  useEffect(() => {
    if (!isSessionActive || !sessionStart) return;
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStart]);

  useEffect(() => {
    fetchSessionHistory();
  }, []);

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const auraAnimationSpeed = 5 - Math.min((sessionHistory.length > 0 ? sessionHistory.reduce((acc: number, s: any) => acc + (s.focusScore || 0), 0) / sessionHistory.length : 0) / 25, 4);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0f172a] text-white flex flex-col">
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ scale: [1, 1.4, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: auraAnimationSpeed, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(circle at center, rgba(59,130,246,0.15), transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      <div className="relative z-10 p-10 flex-grow max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Your <span className="text-blue-500">Focus Session</span>
          </h1>
          <div className="flex items-center space-x-2 bg-blue-600/20 px-4 py-2 rounded-lg shadow">
            <Sparkles className="text-blue-400" />
            <span className="text-sm font-medium text-blue-200">Live Coaching Mode</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl space-y-6"
          >
            <h2 className="text-xl font-semibold">🕒 Session Timer</h2>
            <div className="flex items-center justify-center bg-gray-700/40 p-4 rounded-lg">
              <Clock className="text-blue-400 mr-2" />
              <span className="text-2xl font-mono text-white">{formatElapsedTime(elapsedTime)}</span>
            </div>
            <div className="flex justify-center">
              {!isSessionActive ? (
                <button onClick={startSession} className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/80 to-indigo-500/80 text-white rounded-lg hover:bg-green-700 transition">
                  <Play className="mr-2" size={18} /> Start Session
                </button>
              ) : (
                <button onClick={endSession} className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  <Square className="mr-2" size={18} /> End Session
                </button>
              )}
            </div>
            <div className="mt-4 p-3 bg-gray-700/40 rounded-lg">
              <h3 className="text-sm text-gray-400 mb-1">Status</h3>
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full mr-2 ${isSessionActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-gray-300">{isSessionActive ? 'Tracking activity...' : 'Idle'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <FocusCoach isLoading={isLoading} />
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-700/30 backdrop-blur-lg p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center mb-5">
                <BarChart2 className="text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Focus Analytics</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Average Focus</div>
                  <div className="text-2xl text-blue-400 font-bold mt-1">
                    {sessionHistory.length > 0 ? Math.round(sessionHistory.reduce((acc: number, s: any) => acc + (s.focusScore || 0), 0) / sessionHistory.length) : 0}%
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Best Session</div>
                  <div className="text-2xl text-green-400 font-bold mt-1">
                    {sessionHistory.length > 0 ? Math.max(...sessionHistory.map((s: any) => s.focusScore || 0)) : 0}%
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Total Sessions</div>
                  <div className="text-2xl text-yellow-400 font-bold mt-1">{sessionHistory.length}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p className="opacity-60">✨ Stay focused. Let AURA guide you.</p>
        </footer>
      </div>

      <ActivityTracker
        isActive={isSessionActive}
        onKeyPress={() => console.log('Key pressed')}
        onMouseClick={() => console.log('Mouse clicked')}
        onMouseMove={(distance: number) => console.log(`Mouse moved: ${distance.toFixed(2)}px`)}
      />
    </div>
  );
}
