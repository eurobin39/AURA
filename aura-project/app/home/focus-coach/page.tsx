"use client";

import { useState, useEffect } from 'react';
import { Clock, Play, Square, BarChart2, History } from 'lucide-react';
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
  
  // End current session
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
  
  // Track activity events
  const handleKeyPress = () => {
    // Send to API in a real implementation
    console.log('Key pressed');
  };
  
  const handleMouseClick = () => {
    // Send to API in a real implementation
    console.log('Mouse clicked');
  };
  
  const handleMouseMove = (distance: number) => {
    // Send to API in a real implementation
    console.log(`Mouse moved: ${distance.toFixed(2)}px`);
  };
  
  // Fetch session history
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
  
  // Update elapsed time
  useEffect(() => {
    if (!isSessionActive || !sessionStart) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isSessionActive, sessionStart]);
  
  // Fetch initial session history
  useEffect(() => {
    fetchSessionHistory();
  }, []);
  
  // Format elapsed time as HH:MM:SS
  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-400 mb-8">AURA Focus Coach</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session Control Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Work Session</h2>
              
              {/* Timer Display */}
              <div className="flex items-center justify-center bg-gray-800/70 p-4 rounded-lg mb-6">
                <Clock className="text-blue-400 mr-2" />
                <span className="text-2xl font-mono text-white">
                  {formatElapsedTime(elapsedTime)}
                </span>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center">
                {!isSessionActive ? (
                  <button
                    onClick={startSession}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  >
                    <Play className="mr-2" size={18} />
                    Start Session
                  </button>
                ) : (
                  <button
                    onClick={endSession}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    <Square className="mr-2" size={18} />
                    End Session
                  </button>
                )}
              </div>
              
              {/* Session Activity Monitor */}
              <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Session Status</h3>
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${isSessionActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <span className="text-gray-300">
                    {isSessionActive ? 'Tracking activity...' : 'Idle'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Recent Sessions */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 mt-6">
              <div className="flex items-center mb-4">
                <History className="text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
              </div>
              
              {sessionHistory.length > 0 ? (
                <div className="space-y-3">
                  {sessionHistory.slice(0, 5).map((session: any) => (
                    <div key={session.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-gray-300">
                            {new Date(session.startTime).toLocaleDateString()} at{' '}
                            {new Date(session.startTime).toLocaleTimeString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            Duration: {session.endTime 
                              ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000) 
                              : 0} minutes
                          </div>
                        </div>
                        <div className="bg-blue-600/70 px-2 py-1 rounded text-white">
                          {session.focusScore}/100
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">No session history found</p>
              )}
            </div>
          </div>
          
          {/* AI Coach Panel */}
          <div className="lg:col-span-2">
            <FocusCoach insight={latestInsight} isLoading={isLoading} />
            
            {/* Focus Analytics */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 mt-6">
              <div className="flex items-center mb-4">
                <BarChart2 className="text-blue-400 mr-2" />
                <h2 className="text-xl font-semibold text-white">Focus Analytics</h2>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Average Focus</div>
                  <div className="text-2xl text-blue-400 font-bold mt-1">
                    {sessionHistory.length > 0 
                      ? Math.round(sessionHistory.reduce((acc: number, s: any) => acc + (s.focusScore || 0), 0) / sessionHistory.length) 
                      : 0}%
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Best Session</div>
                  <div className="text-2xl text-green-400 font-bold mt-1">
                    {sessionHistory.length > 0 
                      ? Math.max(...sessionHistory.map((s: any) => s.focusScore || 0)) 
                      : 0}%
                  </div>
                </div>
                
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-400">Total Sessions</div>
                  <div className="text-2xl text-yellow-400 font-bold mt-1">
                    {sessionHistory.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden activity tracker */}
      <ActivityTracker
        isActive={isSessionActive}
        onKeyPress={handleKeyPress}
        onMouseClick={handleMouseClick}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
} 