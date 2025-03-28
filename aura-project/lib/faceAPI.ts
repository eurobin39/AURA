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
    console.error("Missing Face API environment variables");
    return () => {};
  }

  let stream: MediaStream | null = null;
  let timeoutId: number | null = null;

  const saveFaceData = async (data: { focusScore: number; yaw: number; pitch: number }) => {
    try {
      const response = await fetch("/api/face-focus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to save face data:", error);
        return false;
      }

      const result = await response.json();
      console.log("Face data saved successfully:", result);
      return true;
    } catch (error) {
      console.error("Error saving face data:", error);
      return false;
    }
  };

  const analyzeFrame = async () => {
    if (!isSessionActiveRef.current || !videoRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Could not get canvas context");
        return;
      }

      ctx.drawImage(videoRef.current, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.8)
      );

      if (!blob) {
        console.error("Failed to create image blob");
        return;
      }

      // ✅ MUST set correct Content-Type to application/octet-stream
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
        console.error("Face detection failed:", errorText);
        return;
      }

      const faces = await detectionResponse.json();
      if (faces.length > 0) {
        const { yaw, pitch } = faces[0].faceAttributes.headPose;

        const centralityPenalty =
          Math.sqrt(
            Math.max(Math.abs(yaw) - 5, 0) ** 2 +
            Math.max(Math.abs(pitch) - 5, 0) ** 2
          ) * 2;

        const focusScore = Math.max(0, 100 - centralityPenalty);
        const roundedScore = Math.round(focusScore);

        setFaceData({ focusScore: roundedScore, yaw, pitch });

        await saveFaceData({ focusScore: roundedScore, yaw, pitch });
      }
    } catch (error) {
      console.error("Error in face analysis:", error);
    } finally {
      if (isSessionActiveRef.current) {
        timeoutId = window.setTimeout(analyzeFrame, 5000); // ✅ 5초마다 호출
      }
    }
  };

  const init = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("[FaceAPI] Video loaded, starting analysis...");
          analyzeFrame(); // 🔥 첫 호출
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  init();

  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (stream) stream.getTracks().forEach((track) => track.stop());
  };
};
