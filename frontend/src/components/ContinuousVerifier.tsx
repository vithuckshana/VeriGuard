"use client";

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { AlertTriangle } from 'lucide-react';

export default function ContinuousVerifier() {
  const webcamRef = useRef<Webcam>(null);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      verifyIdentity();
    }, 10000); // Check every 10 seconds for demo purposes

    return () => clearInterval(interval);
  }, []);

  const verifyIdentity = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    // Simulate backend verification
    console.log("Sending frame to backend for continuous verification...");
    
    // Simulate a random failure (10% chance) to demonstrate the alert
    if (Math.random() > 0.9) {
      setAlert("Unauthorized user detected! Session will be locked.");
      // In a real app, we would redirect to a lock screen or logout.
      setTimeout(() => setAlert(null), 5000);
    }
  };

  return (
    <>
      {/* Hidden webcam for background processing */}
      <div className="hidden">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
        />
      </div>

      {alert && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-xl flex items-center z-50 animate-bounce">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <span className="font-semibold">{alert}</span>
        </div>
      )}
    </>
  );
}
