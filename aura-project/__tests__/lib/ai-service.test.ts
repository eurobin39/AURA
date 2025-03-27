import { AuraAIService } from '../../lib/ai-service';
import { AzureOpenAI } from 'openai';

jest.mock('openai');

describe('AuraAIService', () => {
  let aiService: AuraAIService;
  
  beforeEach(() => {
    aiService = new AuraAIService();
    
    // Mock OpenAI response
    (AzureOpenAI.prototype.completions.create as jest.Mock).mockResolvedValue({
      choices: [{
        text: JSON.stringify({
          analysis: "Test analysis",
          tips: ["tip1", "tip2", "tip3"],
          insight: "Test insight"
        })
      }]
    });
  });
  
  describe('generateFocusInsights', () => {
    it('should generate properly formatted insights', async () => {
      const activityData = {
        keystrokes: 100,
        clicks: 50,
        mouseMoved: 1000,
        activeApps: ['VSCode', 'Chrome'],
        sessionDuration: 30,
        timeOfDay: 'morning'
      };
      
      const result = await aiService.generateFocusInsights(activityData);
      
      expect(result).toEqual({
        summary: expect.any(String),
        score: expect.any(Number),
        date: expect.any(Date)
      });
    });
    
    it('should handle API errors gracefully', async () => {
      (AzureOpenAI.prototype.completions.create as jest.Mock).mockRejectedValue(
        new Error('API Error')
      );
      
      const activityData = {
        keystrokes: 100,
        clicks: 50,
        mouseMoved: 1000,
        activeApps: ['VSCode'],
        sessionDuration: 30,
        timeOfDay: 'morning'
      };
      
      const result = await aiService.generateFocusInsights(activityData);
      
      expect(result).toEqual({
        summary: "Unable to analyze work session.",
        score: 0,
        date: expect.any(Date)
      });
    });
    
    it('should handle malformed API responses', async () => {
      (AzureOpenAI.prototype.completions.create as jest.Mock).mockResolvedValue({
        choices: [{
          text: "Invalid JSON"
        }]
      });
      
      const activityData = {
        keystrokes: 100,
        clicks: 50,
        mouseMoved: 1000,
        activeApps: ['VSCode'],
        sessionDuration: 30,
        timeOfDay: 'morning'
      };
      
      const result = await aiService.generateFocusInsights(activityData);
      
      expect(result).toEqual({
        summary: "Unable to analyze work session.",
        score: 0,
        date: expect.any(Date)
      });
    });
  });
}); 