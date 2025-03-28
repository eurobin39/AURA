"use client";

import { startTracking } from "./tracker";
import { startFaceAnalysis } from "./faceAPI";
import { RefObject } from "react";

// Global state to track if session is active
let isSessionActiveGlobal = false;
let cleanupFunctions: Array<() => void> = [];

// Check if we're in the browser environment
const isBrowser = typeof window !== 'undefined';

// Function to check if a session is currently active
export function getSessionStatus(): boolean {
  if (!isBrowser) return false;
  
  const storedSession = localStorage.getItem('focus_session_active');
  return storedSession === 'true';
}

// Function to get the stored session start time
export function getSessionStartTime(): Date | null {
  if (!isBrowser) return null;
  
  const storedStart = localStorage.getItem('focus_session_start');
  return storedStart ? new Date(storedStart) : null;
}

// Function to start a session that persists across page navigations
export async function startPersistentSession(
  setFocusData: (data: any) => void,
  setFaceData: (data: any) => void,
  videoRef: RefObject<HTMLVideoElement>
): Promise<boolean> {
  try {
    // Call the API to start the session
    const sessionResponse = await fetch("/api/focus-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!sessionResponse.ok) {
      throw new Error("Failed to start session");
    }

    // Set global flag and localStorage
    isSessionActiveGlobal = true;
    
    if (isBrowser) {
      localStorage.setItem('focus_session_active', 'true');
      localStorage.setItem('focus_session_start', new Date().toISOString());
    }

    // Create a ref object that always reflects the current state
    const isActiveRef = { current: true };

    // Ensure cleanup functions are empty before starting
    cleanupFunctions.forEach(fn => fn());
    cleanupFunctions = [];

    // Start trackers and store cleanup functions
    cleanupFunctions.push(startTracking(setFocusData, isActiveRef));
    cleanupFunctions.push(startFaceAnalysis(videoRef, setFaceData, isActiveRef));

    // Set up a window event listener for page close/refresh
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Inform user session is still active
      e.returnValue = "Your focus session is still active. Are you sure you want to leave?";
      return e.returnValue;
    };
    
    if (isBrowser) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      cleanupFunctions.push(() => window.removeEventListener('beforeunload', beforeUnloadHandler));
    }

    return true;
  } catch (error) {
    console.error("Error starting persistent session:", error);
    return false;
  }
}

// Function to end the persistent session
export async function endPersistentSession(): Promise<any> {
  try {
    // Call the API to end the session
    const response = await fetch("/api/focus-sessions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error("Failed to end session");
    }

    // Reset global flag and localStorage
    isSessionActiveGlobal = false;
    
    if (isBrowser) {
      localStorage.removeItem('focus_session_active');
      localStorage.removeItem('focus_session_start');
    }

    // Execute all cleanup functions
    cleanupFunctions.forEach(cleanup => cleanup());
    cleanupFunctions = [];

    return result;
  } catch (error) {
    console.error("Error ending persistent session:", error);
    return null;
  }
} 