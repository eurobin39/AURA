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
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a new instance for each test
    sessionTracker = new SessionTracker();
    
    // Mock implementations
    (db.workSession.create as jest.Mock).mockResolvedValue({ 
      id: 1, 
      userId: 123, 
      startTime: new Date(),
      activeApps: []
    });
    
    (db.workSession.update as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 123,
      startTime: new Date(),
      endTime: new Date(),
      keystrokes: 50,
      mouseClicks: 20,
      mouseDistance: 1000,
      activeApps: ['VSCode', 'Chrome'],
      focusScore: 75
    });
    
    (aiService.generateFocusInsights as jest.Mock).mockResolvedValue({
      analysis: 'Test analysis',
      tips: ['Tip 1', 'Tip 2'],
      insight: 'Key insight'
    });
    
    (db.focusInsight.create as jest.Mock).mockResolvedValue({
      id: 1,
      sessionId: 1,
      userId: 123,
      analysis: 'Test analysis',
      tips: ['Tip 1', 'Tip 2'],
      insight: 'Key insight'
    });
  });
  
  it('should create a new session when startSession is called', async () => {
    const userId = 123;
    const session = await sessionTracker.startSession(userId);
    
    expect(db.workSession.create).toHaveBeenCalledWith({
      data: {
        userId,
        startTime: expect.any(Date),
        activeApps: []
      }
    });
    
    expect(session).toEqual({
      id: 1,
      userId: 123,
      startTime: expect.any(Date),
      activeApps: []
    });
  });
  
  it('should end the current session when endSession is called', async () => {
    // First start a session
    await sessionTracker.startSession(123);
    
    // End the session
    const result = await sessionTracker.endSession();
    
    expect(db.workSession.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        endTime: expect.any(Date),
        keystrokes: 0, // Should be 0 since we didn't track any keystrokes
        mouseClicks: 0, // Should be 0 since we didn't track any clicks
        mouseDistance: 0, // Should be 0 since we didn't track any mouse movement
        activeApps: [],
        focusScore: expect.any(Number)
      }
    });
    
    expect(aiService.generateFocusInsights).toHaveBeenCalled();
    expect(db.focusInsight.create).toHaveBeenCalled();
    
    expect(result).toEqual({
      session: expect.objectContaining({
        id: 1,
        userId: 123
      }),
      insights: expect.objectContaining({
        id: 1,
        sessionId: 1,
        userId: 123
      })
    });
  });
  
  it('should track keystrokes properly', async () => {
    // Start a session
    await sessionTracker.startSession(123);
    
    // Track some keystrokes
    sessionTracker.trackKeyPress();
    sessionTracker.trackKeyPress();
    sessionTracker.trackKeyPress();
    
    // End the session
    await sessionTracker.endSession();
    
    // Check that keystrokes were counted
    expect(db.workSession.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          keystrokes: 3
        })
      })
    );
  });
  
  it('should track mouse clicks properly', async () => {
    // Start a session
    await sessionTracker.startSession(123);
    
    // Track some clicks
    sessionTracker.trackMouseClick();
    sessionTracker.trackMouseClick();
    
    // End the session
    await sessionTracker.endSession();
    
    // Check that clicks were counted
    expect(db.workSession.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          mouseClicks: 2
        })
      })
    );
  });
  
  it('should track mouse movement properly', async () => {
    // Start a session
    await sessionTracker.startSession(123);
    
    // Track some mouse movement
    sessionTracker.trackMouseMove(100);
    sessionTracker.trackMouseMove(150);
    
    // End the session
    await sessionTracker.endSession();
    
    // Check that mouse distance was accumulated
    expect(db.workSession.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          mouseDistance: 250
        })
      })
    );
  });
  
  it('should track active applications', async () => {
    // Start a session
    await sessionTracker.startSession(123);
    
    // Track some apps
    sessionTracker.trackApplication('Chrome');
    sessionTracker.trackApplication('VSCode');
    sessionTracker.trackApplication('Chrome'); // Duplicates should be handled
    
    // End the session
    await sessionTracker.endSession();
    
    // Check that apps were tracked
    expect(db.workSession.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          activeApps: expect.arrayContaining(['Chrome', 'VSCode'])
        })
      })
    );
  });
  
  it('should calculate focus score correctly', async () => {
    // Start a session
    await sessionTracker.startSession(123);
    
    // Track lots of activity for high focus score
    for (let i = 0; i < 350; i++) sessionTracker.trackKeyPress();
    for (let i = 0; i < 120; i++) sessionTracker.trackMouseClick();
    for (let i = 0; i < 6; i++) sessionTracker.trackMouseMove(1000);
    
    // End the session
    await sessionTracker.endSession();
    
    // Focus score should be near max (100)
    const updateCall = (db.workSession.update as jest.Mock).mock.calls[0][0];
    expect(updateCall.data.focusScore).toBeGreaterThanOrEqual(90);
  });
  
  it('should handle errors when generating insights', async () => {
    // Mock AI service to throw error
    (aiService.generateFocusInsights as jest.Mock).mockRejectedValue(new Error('AI service error'));
    
    // Start and end a session
    await sessionTracker.startSession(123);
    const result = await sessionTracker.endSession();
    
    // Should still complete but with null insights
    expect(result.session).toBeDefined();
    expect(result.insights).toBeNull();
  });
}); 