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
    
    // Update only the fields that we know exist in the schema
    const updatedSession = await db.workSession.update({
      where: { id: this.activeSession.id },
      data: {
        endTime: new Date(),
        activeApps: Array.from(this.activeApps)
        // Removed fields that might not be in the schema:
        // keystrokes, mouseClicks, mouseDistance, focusScore
      }
    });
    
    // Get AI-generated insights
    const aiInsights = await this.generateInsights(updatedSession);
    
    // Reset the active session
    this.activeSession = null;
    
    return {
      session: updatedSession,
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
      
      // Get latest focus data directly from the database
      let focusStats = {
        keystrokes: this.keyCount,
        clicks: this.clickCount,
        mouseMoved: this.mouseDistance
      };
      
      try {
        // Get the most recent focus log directly from the database
        const latestLog = await db.focusLog.findFirst({
          where: { userId: session.userId },
          orderBy: { timestamp: 'desc' }
        });
        
        if (latestLog) {
          // Use the latest log data instead of internal counters
          focusStats = {
            keystrokes: latestLog.keyboard || this.keyCount,
            clicks: latestLog.mouseClicks || this.clickCount,
            mouseMoved: latestLog.mouseDistance || this.mouseDistance
          };
        }
      } catch (error) {
        console.error("Error retrieving latest focus data:", error);
      }
      
      // Get face data directly from the database
      let faceData = null;
      try {
        // Query face logs for this session's time range
        const faceLogs = await db.faceFocusLog.findMany({
          where: {
            userId: session.userId,
            timestamp: {
              gte: session.startTime,
              lte: session.endTime || new Date()
            }
          },
          orderBy: { timestamp: 'desc' },
          take: 50
        });
        
        if (faceLogs.length > 0) {
          // Calculate average values from face logs
          const avgFocusScore = faceLogs.reduce((sum: number, log: any) => sum + log.focusScore, 0) / faceLogs.length;
          const avgYaw = faceLogs.reduce((sum: number, log: any) => sum + log.yaw, 0) / faceLogs.length;
          const avgPitch = faceLogs.reduce((sum: number, log: any) => sum + log.pitch, 0) / faceLogs.length;
          
          faceData = {
            focusScore: avgFocusScore,
            yaw: avgYaw,
            pitch: avgPitch
          };
        }
      } catch (error) {
        console.error("Error retrieving face data:", error);
      }
      
      // Get insights with the latest data
      const aiResponse = await aiService.generateFocusInsights({
        keystrokes: focusStats.keystrokes,
        clicks: focusStats.clicks,
        mouseMoved: focusStats.mouseMoved,
        activeApps: session.activeApps,
        sessionDuration: duration,
        timeOfDay,
        faceData: faceData
      });
      
      // Return the AI insights
      return {
        analysis: aiResponse.analysis,
        tips: aiResponse.tips,
        insight: aiResponse.insight,
        focusScore: this.calculateFocusScore(),
        date: new Date()
      };
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