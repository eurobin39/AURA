"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Brain, Lightbulb, Zap } from 'lucide-react';

interface FocusInsight {
  analysis: string;
  tips: string[];
  insight: string;
}

interface FocusCoachProps {
  insight?: FocusInsight;
  isLoading?: boolean;
}

export default function FocusCoach({ 
  insight, 
  isLoading = false 
}: FocusCoachProps) {
  const [expanded, setExpanded] = useState(false);
  
  const defaultInsight = {
    analysis: "Welcome to your AI Focus Coach! Start a work session to get personalized insights.",
    tips: [
      "Set clear goals before starting work",
      "Try the Pomodoro technique (25 min work, 5 min break)",
      "Create a distraction-free environment"
    ],
    insight: "Your optimal focus conditions are unique to you. Let's discover them together!"
  };
  
  const displayInsight = insight || defaultInsight;
  
  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-700 transition-all hover:shadow-2xl">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-xl font-semibold text-blue-400 flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          AI Focus Coach
        </h3>
        {expanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </div>
      
      {isLoading ? (
        <div className="mt-4 flex justify-center items-center h-24">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-blue-500 rounded-full animate-spin mb-2"></div>
            <p className="text-gray-400">Analyzing your work patterns...</p>
          </div>
        </div>
      ) : (
        <div className={`mt-4 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-24'}`}>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300">{displayInsight.analysis}</p>
            
            {expanded && (
              <>
                <div className="mt-4">
                  <h4 className="text-green-400 font-medium flex items-center">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Personalized Tips
                  </h4>
                  <ul className="mt-2 space-y-2">
                    {displayInsight.tips.map((tip, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-blue-400 mr-2">•</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-yellow-400 font-medium flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Key Insight
                  </h4>
                  <p className="mt-1 text-gray-300">{displayInsight.insight}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 