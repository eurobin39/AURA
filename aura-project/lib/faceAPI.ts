"use client";

import { RefObject } from "react";

export const startFaceAnalysis = (
  videoRef: RefObject<HTMLVideoElement | null>,
  setFaceData: (data: { focusScore: number; yaw: number; pitch: number }) => void,
  isSessionActiveRef: RefObject<boolean>
) => {
  const FACE_API_ENDPOINT = process.env.NEXT_PUBLIC_FACE_API_ENDPOINT;
  const FACE_API_KEY = process.env.NEXT_PUBLIC_FACE_API_KEY;

  if (!FACE_API_ENDPOINT || !FACE_API_KEY) {
    console.error("❌ Missing Face API environment variables");
    return () => {};
  }

  let stream: MediaStream | null = null;
  let timeoutId: number | null = null;

  const saveFaceData = async (data: { focusScore: number; yaw: number; pitch: number }) => {
    try {
      console.log("📤 Saving face data:", data);
      const response = await fetch("/api/face-focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Failed to save face data:", error);
        return false;
      }

      const result = await response.json();
      console.log("✅ Face data saved:", result);
      return true;
    } catch (error) {
      console.error("❌ Error saving face data:", error);
      return false;
    }
  };

  const analyzeFrame = async () => {
    console.log("🎯 analyzeFrame started");

    if (!isSessionActiveRef.current) {
      console.warn("⚠️ Session is not active");
      return;
    }
    if (!videoRef.current) {
      console.warn("⚠️ videoRef is null");
      return;
    }

    const video = videoRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    console.log("📏 Video size:", width, height);

    // 📛 비디오 사이즈가 아직 준비 안 됐으면 재시도
    if (width === 0 || height === 0) {
      console.warn("⏳ Video not ready yet, retrying in 500ms...");
      timeoutId = window.setTimeout(analyzeFrame, 500);
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("❌ Could not get canvas context");
        return;
      }

      ctx.drawImage(video, 0, 0, width, height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.8)
      );

      if (!blob) {
        console.error("❌ Failed to create image blob");
        return;
      }

      console.log("📸 Captured image blob, sending to Face API");

      const detectionResponse = await fetch(
        `${FACE_API_ENDPOINT}/face/v1.0/detect?returnFaceAttributes=headPose`,
        {
          method: "POST",
          headers: {
            "Ocp-Apim-Subscription-Key": FACE_API_KEY,
            "Content-Type": "application/octet-stream",
          },
          body: blob,
        }
      );

      if (!detectionResponse.ok) {
        const errorText = await detectionResponse.text();
        console.error("❌ Face detection failed:", errorText);
        return;
      }

      const faces = await detectionResponse.json();
      console.log("🧠 Face detection result:", faces);

      if (faces.length > 0) {
        const { yaw, pitch } = faces[0].faceAttributes.headPose;
        const centralityPenalty =
          Math.sqrt(
            Math.max(Math.abs(yaw) - 5, 0) ** 2 +
            Math.max(Math.abs(pitch) - 5, 0) ** 2
          ) * 2;

        const focusScore = Math.max(0, 100 - centralityPenalty);
        const roundedScore = Math.round(focusScore);

        console.log("📊 Calculated focusScore:", roundedScore);

        setFaceData({ focusScore: roundedScore, yaw, pitch });

        await saveFaceData({ focusScore: roundedScore, yaw, pitch });
      }
    } catch (error) {
      console.error("❌ Error in analyzeFrame:", error);
    } finally {
      if (isSessionActiveRef.current) {
        timeoutId = window.setTimeout(analyzeFrame, 5000); // ✅ 5초마다 호출
      }
    }
  };

  const init = async () => {
    console.log("🎥 Initializing Face Analysis");
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });
      console.log("✅ Camera stream acquired");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("✅ Video metadata loaded");
          analyzeFrame(); // 첫 실행
        };
      }
    } catch (error) {
      console.error("❌ Error accessing camera:", error);
    }
  };

  init();

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (stream) stream.getTracks().forEach((track) => track.stop());
    console.log("🧹 Face analysis stopped and cleaned up");
  };
};
