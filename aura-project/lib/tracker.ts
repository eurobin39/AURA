"use client";

import { RefObject } from "react";

export const startTracking = (
  setFocusData: (data: { keyboard: number; mouseClicks: number; mouseDistance: number; focusScore: number }) => void,
  isSessionActiveRef: RefObject<boolean>
) => {
  let keyCount = 0;
  let clickCount = 0;
  let mouseDistance = 0;
  let prevX: number | null = null;
  let prevY: number | null = null;
  let isSaving = false;

  console.log("[Tracker] Starting tracking");

  const saveFocusData = async (data: {
    keyboard: number;
    mouseClicks: number;
    mouseDistance: number;
    focusScore: number;
  }) => {
    if (isSaving) {
      console.warn("[Tracker] Already saving, skipping this attempt");
      return false;
    }
    isSaving = true;

    try {
      console.log("[Tracker] Sending data to /api/focus-log:", data);
      const response = await fetch("/api/focus-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const responseText = await response.text();
      if (!response.ok) {
        console.error("[Tracker] Failed to save focus data:", response.status, responseText);
        return false;
      }

      const result = JSON.parse(responseText);
      console.log("[Tracker] Focus data saved successfully:", result);
      return true;
    } catch (error) {
      console.error("[Tracker] Error saving focus data:", error);
      return false;
    } finally {
      isSaving = false;
    }
  };

  const onKeyPress = () => {
    keyCount++;
    console.log("[Tracker] Key press detected, count:", keyCount);
  };
  const onClick = () => {
    clickCount++;
    console.log("[Tracker] Click detected, count:", clickCount);
  };
  const onMouseMove = (e: MouseEvent) => {
    if (prevX !== null && prevY !== null) {
      const distance = Math.hypot(e.clientX - prevX, e.clientY - prevY);
      mouseDistance += distance;
      console.log("[Tracker] Mouse moved, distance:", mouseDistance);
    }
    prevX = e.clientX;
    prevY = e.clientY;
  };

  const addEventListeners = () => {
    document.addEventListener("keydown", onKeyPress);
    document.addEventListener("click", onClick);
    document.addEventListener("mousemove", onMouseMove);
    console.log("[Tracker] Event listeners added");
  };

  const removeEventListeners = () => {
    document.removeEventListener("keydown", onKeyPress);
    document.removeEventListener("click", onClick);
    document.removeEventListener("mousemove", onMouseMove);
    console.log("[Tracker] Event listeners removed");
  };

  // 항상 이벤트 리스너는 등록하고, 내부에서 상태 체크
  addEventListeners();

  const interval = setInterval(async () => {
    if (!isSessionActiveRef.current) {
      console.log("[Tracker] Session inactive, skipping data save");
      return;
    }

    const focusScore = calculateFocusScore(keyCount, clickCount, mouseDistance);
    const data = {
      keyboard: keyCount,
      mouseClicks: clickCount,
      mouseDistance: Math.round(mouseDistance),
      focusScore: Math.round(focusScore),
    };

    console.log("[Tracker] Calculated data:", data);
    setFocusData(data);

    const saved = await saveFocusData(data);

    if (saved) {
      keyCount = clickCount = mouseDistance = 0;
      prevX = prevY = null;
    } else {
      console.warn("[Tracker] Data not saved, preserving counts");
    }
  }, 15000); // 15초마다

  function calculateFocusScore(keys: number, clicks: number, distance: number): number {
    const keyWeight = 0.2 * Math.min(keys / 20, 1);      
    const clickWeight = 0.2 * Math.min(clicks / 5, 1);   
    const moveWeight = 0.6 * Math.min(distance / 300, 1); 
  
    const rawScore = (keyWeight + clickWeight + moveWeight) * 100;
    const boostedScore = Math.min(rawScore + 20, 100); 
  
    console.log("[Tracker] Relaxed focus score:", boostedScore);
    return Math.round(boostedScore);
  }
  
  
  

  return () => {
    removeEventListeners();
    clearInterval(interval);
    console.log("[Tracker] Cleanup completed");
  };
};
