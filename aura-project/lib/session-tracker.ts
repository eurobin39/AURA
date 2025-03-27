import db from "./db";
import { aiService } from "./ai-service";

// Simplified session tracking for hackathon
export class SessionTracker {
  private static instance: SessionTracker;
  private activeSession: any = null;
  private keyCount: number = 0;
  private clickCount: number = 0;
  private mouseDistance: number = 0;
  private activeApps: Set<string> = new Set();
  
  // Singleton pattern
  public static getInstance(): SessionTracker {
    if (!SessionTracker.instance) {
      SessionTracker.instance = new SessionTracker();
    }
    return SessionTracker.instance;
  }
  
  // Get active session for a user
  async getActiveSession(userId: number): Promise<any> {
    if (this.activeSession && this.activeSession.userId === userId) {
      return this.activeSession;
    }
    
    // Try to find an active session in the database
    const activeSession = await db.workSession.findFirst({
      where: {
        userId,
        endTime: null
      }
    });
    
    if (activeSession) {
      this.activeSession = activeSession;
      // Restore counters from the most recent focus log
      const focusLog = await db.focusLog.findFirst({
        where: { userId: activeSession.userId },
        orderBy: { timestamp: 'desc' }
      });
      
      if (focusLog) {
        this.keyCount = focusLog.keyboard;
        this.clickCount = focusLog.mouseClicks;
        this.mouseDistance = focusLog.mouseDistance;
      }
    }
    
    return activeSession;
  }
  
  // Persist current session state
  async persistSessionState(): Promise<void> {
    if (!this.activeSession) return;
    
    await db.workSession.update({
      where: { id: this.activeSession.id },
      data: {
        lastActive: new Date(),
        activeApps: Array.from(this.activeApps)
      }
    });
  }
  
  // Start a new work session
  async startSession(userId: number): Promise<any> {
    if (this.activeSession) {
      await this.endSession();
    }
    
    this.resetCounters();
    
    // Verify that the user exists first
    const user = await db.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error(`Cannot start session: User with ID ${userId} does not exist`);
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Create new session in database
    this.activeSession = await db.workSession.create({
      data: {
        userId,
        startTime: new Date(),
        activeApps: []
      }
    });
    
    return this.activeSession;
  }
  
  // End current session and generate insights
  async endSession(): Promise<any> {
    if (!this.activeSession) return null;
    
    // Update work session
    const updatedSession = await db.workSession.update({
      where: { id: this.activeSession.id },
      data: {
        endTime: new Date(),
        activeApps: Array.from(this.activeApps)
      }
    });

    // Create focus log entry for the metrics
    const focusLog = await db.focusLog.create({
      data: {
        userId: updatedSession.userId,
        keyboard: this.keyCount,
        mouseClicks: this.clickCount,
        mouseDistance: this.mouseDistance,
        focusScore: this.calculateFocusScore()
      }
    });

    // Get AI-generated insights
    const aiInsights = await this.generateInsights(updatedSession);
    
    this.activeSession = null;
    
    return {
      session: updatedSession,
      focusLog: focusLog,
      insights: aiInsights
    };
  }
  
  // Track keyboard activity
  trackKeyPress(): void {
    if (!this.activeSession) return;
    this.keyCount++;
  }
  
  // Track mouse clicks
  trackMouseClick(): void {
    if (!this.activeSession) return;
    this.clickCount++;
  }
  
  // Track mouse movement
  trackMouseMove(distance: number): void {
    if (!this.activeSession) return;
    this.mouseDistance += distance;
  }
  
  // Track active application
  trackApplication(appName: string): void {
    if (!this.activeSession) return;
    this.activeApps.add(appName);
  }
  
  // Calculate focus score (simplified algorithm)
  private calculateFocusScore(): number {
    const keyScore = Math.min(this.keyCount / 300, 1.0) * 0.5;
    const clickScore = Math.min(this.clickCount / 100, 1.0) * 0.2;
    const moveScore = Math.min(this.mouseDistance / 5000, 1.0) * 0.3;
    
    return Math.round((keyScore + clickScore + moveScore) * 100);
  }
  
  // Generate AI insights from session data
  private async generateInsights(session: any): Promise<any> {
    try {
      const duration = session.endTime 
        ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000) 
        : 0;
      
      const timeOfDay = this.getTimeOfDay(session.startTime);
      
      const aiResponse = await aiService.generateFocusInsights({
        keystrokes: this.keyCount,
        clicks: this.clickCount,
        mouseMoved: this.mouseDistance,
        activeApps: session.activeApps,
        sessionDuration: duration,
        timeOfDay
      });
      
      // Create FocusInsight in database
      return await db.focusInsight.create({
        data: {
          ...aiResponse,
          userId: session.userId,
          workSessionId: session.id
        }
      });
    } catch (error) {
      console.error("Failed to generate insights:", error);
      return null;
    }
  }
  
  // Get time of day category
  private getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  }
  
  // Reset all counters
  private resetCounters(): void {
    this.keyCount = 0;
    this.clickCount = 0;
    this.mouseDistance = 0;
    this.activeApps = new Set();
  }
}

export const sessionTracker = SessionTracker.getInstance();

// Create a new store using Zustand or similar
interface SessionStore {
  isSessionActive: boolean;
  sessionStart: Date | null;
  setSessionActive: (active: boolean) => void;
  setSessionStart: (start: Date | null) => void;
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    // Page is hidden, but don't end session
    console.log('Page hidden, session continues');
  } else {
    // Page is visible again, sync with server state
    syncSessionState();
  }
};

// Add syncSessionState function
async function syncSessionState() {
  try {
    const response = await fetch('/api/focus-sessions/status');
    const data = await response.json();
    
    if (!data.isActive) {
      // Reset session state if no active session on server
      sessionTracker['activeSession'] = null;
    }
  } catch (error) {
    console.error('Failed to sync session state:', error);
  }
}