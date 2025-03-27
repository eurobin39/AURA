import { AzureOpenAI } from "openai";
import type {
  ChatCompletionMessageParam,
} from "openai/resources/index";
// Simplified Azure OpenAI client for hackathon

export class AuraAIService {
  private client: AzureOpenAI;
  
  constructor() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
    const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
    const apiVersion = "2024-10-21";
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || "";
    
    if (!endpoint || !apiKey || !deploymentName) {
      throw new Error("Missing required Azure OpenAI configuration");
    }

    this.client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion,
      deployment: deploymentName,
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
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a productivity analysis assistant that provides insights based on user activity data. Always respond with valid JSON."
      },
      {
        role: "user",
        content: `Analyze the following work session data and respond ONLY with a JSON object containing exactly these three fields: "analysis" (string), "tips" (array of strings), and "insight" (string).

        Work Session Data:
        - Keystrokes: ${activityData.keystrokes}
        - Mouse clicks: ${activityData.clicks}
        - Mouse movement: ${activityData.mouseMoved}px
        - Active applications: ${activityData.activeApps.join(', ')}
        - Session duration: ${activityData.sessionDuration} minutes
        - Time of day: ${activityData.timeOfDay}
        `
      }
    ];
    
    try {
      const response = await this.client.chat.completions.create({
        messages,
        temperature: 0.7,
        max_tokens: 500,
        model: process.env.AZURE_OPENAI_DEPLOYMENT || ""
      });
      
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in AI response");
      }
      
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to generate insights:", e);
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