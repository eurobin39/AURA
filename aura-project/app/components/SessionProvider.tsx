'use client';

import { useEffect } from 'react';
import { useSessionStore } from '@/lib/session-store';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { isSessionActive, sessionId, setSessionActive, setSessionStart, setSessionId, resetSession } = useSessionStore();

  useEffect(() => {
    // Check for existing active session on mount
    const checkActiveSession = async () => {
      try {
        const response = await fetch('/api/focus-sessions/status');
        const data = await response.json();
        
        if (data.isActive && data.session) {
          setSessionActive(true);
          setSessionStart(new Date(data.session.startTime));
          setSessionId(data.session.id);
        }
      } catch (error) {
        console.error('Failed to check active session:', error);
      }
    };

    checkActiveSession();

    // Set up visibility change handler
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // Page is hidden, but don't end session
        console.log('Page hidden, session continues');
      } else if (isSessionActive && sessionId) {
        // Page is visible again, sync with server state
        try {
          const response = await fetch('/api/focus-sessions/status');
          const data = await response.json();
          
          if (!data.isActive) {
            resetSession();
          }
        } catch (error) {
          console.error('Failed to sync session state:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSessionActive, sessionId, setSessionActive, setSessionStart, setSessionId, resetSession]);

  return <>{children}</>;
} 