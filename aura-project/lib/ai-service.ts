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
      timeOfDay: string,
      faceData?: { 
        focusScore: number,
        yaw: number,
        pitch: number
      } | null
    }
  ) {
    // Safety check and formatting for face data
    const formatNumber = (value: number | undefined | null): string => {
      return typeof value === 'number' ? value.toFixed(1) : '0.0';
    };

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
        - Active applications: ${activityData.activeApps?.join(', ') || 'None recorded'}
        - Session duration: ${activityData.sessionDuration} minutes
        - Time of day: ${activityData.timeOfDay}
        ${activityData.faceData ? `
        - Face focus score: ${formatNumber(activityData.faceData.focusScore)}
        - Face position - Yaw: ${formatNumber(activityData.faceData.yaw)}°
        - Face position - Pitch: ${formatNumber(activityData.faceData.pitch)}°
        ` : ''}
        
        ${activityData.faceData ? 'Please analyze both the input activity (keyboard/mouse) and face position data to provide a comprehensive assessment of focus and ergonomics.' : 'Please analyze the input activity data to assess focus patterns.'}
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
        analysis: "Unable to analyze work session.",
        tips: ["Take regular breaks", "Stay hydrated", "Minimize distractions"],
        insight: "Consider tracking more data for better insights."
      };
    }
  }
}

export const aiService = new AuraAIService(); 