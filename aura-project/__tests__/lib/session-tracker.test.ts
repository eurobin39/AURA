import { SessionTracker } from '../../lib/session-tracker';
import db from '../../lib/db';
import { aiService } from '../../lib/ai-service';

// Mock the dependencies
jest.mock('../../lib/db', () => ({
  workSession: {
    create: jest.fn(),
    update: jest.fn()
  },
  focusInsight: {
    create: jest.fn()
  },
  focusLog: {
    create: jest.fn()
  },
  user: {
    findUnique: jest.fn()
  }
}));

jest.mock('../../lib/ai-service', () => ({
  aiService: {
    generateFocusInsights: jest.fn()
  }
}));

describe('SessionTracker', () => {
  let sessionTracker: SessionTracker;
  
  beforeEach(() => {
    sessionTracker = SessionTracker.getInstance();
    jest.clearAllMocks();
    
    // Mock successful user lookup
    (db.user.findUnique as jest.Mock).mockResolvedValue({ id: 123 });
    
    // Mock session creation
    (db.workSession.create as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 123,
      startTime: new Date(),
      activeApps: []
    });
  });
  
  describe('endSession', () => {
    beforeEach(async () => {
      // Start a session before each test
      await sessionTracker.startSession(123);
      
      // Mock session update
      (db.workSession.update as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 123,
        startTime: new Date(),
        endTime: new Date(),
        activeApps: []
      });
      
      // Mock focus log creation
      (db.focusLog.create as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 123,
        keyboard: 0,
        mouseClicks: 0,
        mouseDistance: 0,
        focusScore: 0
      });
      
      // Mock focus insight creation
      (db.focusInsight.create as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 123,
        workSessionId: 1,
        summary: "Test summary",
        score: 75,
        date: new Date()
      });
      
      // Mock AI service response
      (aiService.generateFocusInsights as jest.Mock).mockResolvedValue({
        summary: "Test summary",
        score: 75,
        date: new Date()
      });
    });
    
    it('should end session and create all necessary records', async () => {
      // Track some activity
      sessionTracker.trackKeyPress();
      sessionTracker.trackMouseClick();
      sessionTracker.trackMouseMove(100);
      sessionTracker.trackApplication('VSCode');
      
      const result = await sessionTracker.endSession();
      
      // Check work session update
      expect(db.workSession.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          endTime: expect.any(Date),
          activeApps: ['VSCode']
        }
      });
      
      // Check focus log creation
      expect(db.focusLog.create).toHaveBeenCalledWith({
        data: {
          userId: 123,
          keyboard: 1,
          mouseClicks: 1,
          mouseDistance: 100,
          focusScore: expect.any(Number)
        }
      });
      
      // Check AI insights generation
      expect(aiService.generateFocusInsights).toHaveBeenCalledWith({
        keystrokes: 1,
        clicks: 1,
        mouseMoved: 100,
        activeApps: ['VSCode'],
        sessionDuration: expect.any(Number),
        timeOfDay: expect.any(String)
      });
      
      // Check focus insight creation
      expect(db.focusInsight.create).toHaveBeenCalledWith({
        data: {
          userId: 123,
          workSessionId: 1,
          summary: "Test summary",
          score: 75,
          date: expect.any(Date)
        }
      });
      
      // Check return value structure
      expect(result).toEqual({
        session: expect.any(Object),
        focusLog: expect.any(Object),
        insights: expect.any(Object)
      });
    });
    
    it('should handle no active session', async () => {
      sessionTracker['activeSession'] = null;
      const result = await sessionTracker.endSession();
      expect(result).toBeNull();
    });
    
    it('should handle AI service failure', async () => {
      (aiService.generateFocusInsights as jest.Mock).mockRejectedValue(new Error('AI service failed'));
      
      const result = await sessionTracker.endSession();
      
      expect(result.session).toBeDefined();
      expect(result.focusLog).toBeDefined();
      expect(result.insights).toBeNull();
    });
  });
}); 