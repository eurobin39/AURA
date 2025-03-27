import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  isSessionActive: boolean;
  sessionStart: Date | null;
  sessionId: number | null;
  setSessionActive: (active: boolean) => void;
  setSessionStart: (start: Date | null) => void;
  setSessionId: (id: number | null) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isSessionActive: false,
      sessionStart: null,
      sessionId: null,
      setSessionActive: (active) => set({ isSessionActive: active }),
      setSessionStart: (start) => set({ sessionStart: start }),
      setSessionId: (id) => set({ sessionId: id }),
      resetSession: () => set({ isSessionActive: false, sessionStart: null, sessionId: null }),
    }),
    {
      name: 'session-storage',
    }
  )
); 