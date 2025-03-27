import { AzureOpenAI } from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

// Simplified Azure OpenAI client for hackathon
export class AuraAIService {
  private client: AzureOpenAI;
  
  constructor() {
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "";
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
    const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
    const apiVersion = "2024-10-21";
    
    // Use API key instead of Azure AD token
    this.client = new AzureOpenAI({
      apiKey,
      deployment,
      apiVersion,
      endpoint
    });
  }
  
  async generateFocusInsights(
    activityData: { 
      keystrokes: number, 
      clicks: number, 
      mouseMoved: number,
      activeApps: string[],
      sessionDuration: number,
      timeOfDay: string
    }
  ) {
    const prompt = `
    ## User Work Session Data
    - Keystrokes: ${activityData.keystrokes}
    - Mouse clicks: ${activityData.clicks}
    - Mouse movement: ${activityData.mouseMoved}px
    - Active applications: ${activityData.activeApps.join(', ')}
    - Session duration: ${activityData.sessionDuration} minutes
    - Time of day: ${activityData.timeOfDay}
    
    Based on this work session data, provide:
    1. A short analysis of the user's work patterns (2-3 sentences)
    2. Three specific, actionable tips to improve focus and productivity
    3. One insight about optimal working conditions for this person
    
    Format the response as JSON with keys: "analysis", "tips" (array), and "insight".
    `;
    
    const response = await this.client.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "",
      prompt: [prompt],
      max_tokens: 500,
      temperature: 0.7
      }
    );
    
    try {
      const aiResponse = JSON.parse(response.choices[0].text);
      
      // Format response to match FocusInsight schema
      return {
        summary: aiResponse.analysis,
        score: this.calculateInsightScore(activityData),
        date: new Date(),
        // These fields will be filled by the database layer
        userId: undefined,
        workSessionId: undefined
      };
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return {
        summary: "Unable to analyze work session.",
        score: 0,
        date: new Date()
      };
    }
  }

  // Add helper method to calculate insight score
  private calculateInsightScore(data: { keystrokes: number, clicks: number, mouseMoved: number }): number {
    const keyScore = Math.min(data.keystrokes / 300, 1.0) * 0.5;
    const clickScore = Math.min(data.clicks / 100, 1.0) * 0.2;
    const moveScore = Math.min(data.mouseMoved / 5000, 1.0) * 0.3;
    return Math.round((keyScore + clickScore + moveScore) * 100);
  }
}

export const aiService = new AuraAIService(); 