"use client";

import { useEffect, useState, useRef } from 'react';

interface ActivityTrackerProps {
  onKeyPress?: () => void;
  onMouseClick?: () => void;
  onMouseMove?: (distance: number) => void;
  isActive?: boolean;
}

export default function ActivityTracker({ 
  onKeyPress, 
  onMouseClick, 
  onMouseMove,
  isActive = false
}: ActivityTrackerProps) {
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const isFirstMove = useRef(true);
  
  // Track keyboard activity
  useEffect(() => {
    if (!isActive) return;
    
    const handleKeyPress = () => {
      onKeyPress?.();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isActive, onKeyPress]);
  
  // Track mouse clicks
  useEffect(() => {
    if (!isActive) return;
    
    const handleMouseClick = () => {
      onMouseClick?.();
    };
    
    window.addEventListener('click', handleMouseClick);
    
    return () => {
      window.removeEventListener('click', handleMouseClick);
    };
  }, [isActive, onMouseClick]);
  
  // Track mouse movement
  useEffect(() => {
    if (!isActive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isFirstMove.current) {
        setLastPosition({ x: e.clientX, y: e.clientY });
        isFirstMove.current = false;
        return;
      }
      
      const newPosition = { x: e.clientX, y: e.clientY };
      const distance = Math.hypot(
        newPosition.x - lastPosition.x,
        newPosition.y - lastPosition.y
      );
      
      if (distance > 0) {
        onMouseMove?.(distance);
      }
      
      setLastPosition(newPosition);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isActive, lastPosition, onMouseMove]);
  
  // Track active applications (simplified for hackathon)
  useEffect(() => {
    if (!isActive) return;
    
    // In a real implementation, this would use a browser extension or native app
    // For hackathon purposes, we'll just track browser tab visibility
    const trackVisibilityChange = () => {
      const isVisible = !document.hidden;
      
      if (!isVisible) {
        // User switched to another app/tab
        console.log("User switched away from AURA");
      } else {
        // User returned to AURA
        console.log("User returned to AURA");
      }
    };
    
    document.addEventListener('visibilitychange', trackVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', trackVisibilityChange);
    };
  }, [isActive]);
  
  // This component doesn't render anything visually
  return null;
} 