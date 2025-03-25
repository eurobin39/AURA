import { aiService } from '../../lib/ai-service';
import { OpenAI } from 'openai';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: jest.fn()
          }
        }
      };
    })
  };
});

describe('AI Service', () => {
  let mockOpenAI: jest.Mocked<OpenAI>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Access the mocked implementation
    mockOpenAI = new OpenAI() as unknown as jest.Mocked<OpenAI>;
    
    // Mock the chat.completions.create method
    mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            analysis: "You had a productive session with consistent typing and mouse activity.",
            tips: [
              "Take short breaks every 25 minutes",
              "Stay hydrated while working",
              "Minimize distractions in your environment"
            ],
            insight: "You work best in focused bursts with regular short breaks."
          })
        },
        finish_reason: 'stop',
      }],
      id: 'test-id',
      model: 'gpt-4o',
      created: Date.now(),
      object: 'chat.completion',
    });
  });
  
  it('should generate focus insights correctly', async () => {
    const sessionData = {
      keystrokes: 500,
      clicks: 120,
      mouseMoved: 3000,
      activeApps: ['VSCode', 'Chrome', 'Slack'],
      sessionDuration: 45,
      timeOfDay: 'morning'
    };
    
    const insights = await aiService.generateFocusInsights(sessionData);
    
    // Check the OpenAI API was called with the right parameters
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: expect.any(String),
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining('keystrokes: 500')
          })
        ])
      })
    );
    
    // Check the returned insights
    expect(insights).toEqual({
      analysis: "You had a productive session with consistent typing and mouse activity.",
      tips: [
        "Take short breaks every 25 minutes",
        "Stay hydrated while working",
        "Minimize distractions in your environment"
      ],
      insight: "You work best in focused bursts with regular short breaks."
    });
  });
  
  it('should handle empty session data gracefully', async () => {
    const emptySessionData = {
      keystrokes: 0,
      clicks: 0,
      mouseMoved: 0,
      activeApps: [],
      sessionDuration: 5,
      timeOfDay: 'afternoon'
    };
    
    await aiService.generateFocusInsights(emptySessionData);
    
    // Should still call the API even with empty data
    expect(mockOpenAI.chat.completions.create).toHaveBeenCalled();
  });
  
  it('should handle API errors gracefully', async () => {
    // Mock API error
    mockOpenAI.chat.completions.create = jest.fn().mockRejectedValue(
      new Error('OpenAI API error')
    );
    
    const sessionData = {
      keystrokes: 500,
      clicks: 120,
      mouseMoved: 3000,
      activeApps: ['VSCode', 'Chrome'],
      sessionDuration: 45,
      timeOfDay: 'morning'
    };
    
    // Should throw an error when API fails
    await expect(aiService.generateFocusInsights(sessionData)).rejects.toThrow();
  });
  
  it('should handle malformed API responses gracefully', async () => {
    // Mock malformed response (not valid JSON)
    mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
      choices: [{
        message: {
          content: "This is not valid JSON"
        },
        finish_reason: 'stop',
      }],
      id: 'test-id',
      model: 'gpt-4o',
      created: Date.now(),
      object: 'chat.completion',
    });
    
    const sessionData = {
      keystrokes: 500,
      clicks: 120,
      mouseMoved: 3000,
      activeApps: ['VSCode', 'Chrome'],
      sessionDuration: 45,
      timeOfDay: 'morning'
    };
    
    // Should throw an error when response is not valid JSON
    await expect(aiService.generateFocusInsights(sessionData)).rejects.toThrow();
  });
  
  it('should handle missing fields in API response', async () => {
    // Mock response with missing fields
    mockOpenAI.chat.completions.create = jest.fn().mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            // Missing 'analysis' field
            tips: ["Tip 1", "Tip 2"],
            insight: "Insight"
          })
        },
        finish_reason: 'stop',
      }],
      id: 'test-id',
      model: 'gpt-4o',
      created: Date.now(),
      object: 'chat.completion',
    });
    
    const sessionData = {
      keystrokes: 500,
      clicks: 120,
      mouseMoved: 3000,
      activeApps: ['VSCode', 'Chrome'],
      sessionDuration: 45,
      timeOfDay: 'morning'
    };
    
    const insights = await aiService.generateFocusInsights(sessionData);
    
    // Should provide default values for missing fields
    expect(insights).toHaveProperty('analysis');
    expect(insights.analysis).toBeTruthy();
  });
}); 