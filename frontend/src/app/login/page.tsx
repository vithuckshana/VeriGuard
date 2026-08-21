"use client";

import React, { useState } from 'react';
import WebcamCapture from '@/components/WebcamCapture';
import { Camera, ShieldAlert, ShieldCheck, Hand, Activity } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Randomly select a challenge gesture when the page loads
  const gestures = ["Open Palm", "Thumbs Up", "Peace Sign", "Closed Fist"];
  const [challenge, setChallenge] = useState(gestures[Math.floor(Math.random() * gestures.length)]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend password check
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleFaceCapture = async (imageSrc: string) => {
    setLoading(true);
    setMessage("Verifying face...");
    // Simulate face check
    setTimeout(() => {
      setLoading(false);
      setMessage("");
      setStep(3);
    }, 1500);
  };

  const handleLivenessCapture = async (imageSrc: string) => {
    setLoading(true);
    setMessage("Checking liveness (Blink)...");
    // Simulate liveness check
    setTimeout(() => {
      setLoading(false);
      setMessage("");
      setStep(4);
    }, 1500);
  };

  const handleGestureCapture = async (imageSrc: string) => {
    setLoading(true);
    setMessage(`Verifying gesture: ${challenge}...`);
    // Simulate gesture check
    setTimeout(() => {
      setLoading(false);
      setMessage("Authentication Successful!");
      setStep(5);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
        <div className="flex items-center justify-center mb-8">
          <ShieldCheck className="w-12 h-12 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold text-white tracking-tight">VeriGuard</h1>
        </div>

        {/* Step 1: Password */}
        {step === 1 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                required 
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-semibold rounded-lg p-3 hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        )}

        {/* Step 2: Face */}
        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center justify-center">
              <Camera className="w-6 h-6 mr-2 text-blue-400" /> Face Verification
            </h2>
            <p className="text-slate-400 text-sm">Please position your face clearly in the frame.</p>
            <WebcamCapture onCapture={handleFaceCapture} buttonText="Verify Face" />
            {message && <p className="text-blue-400">{message}</p>}
          </div>
        )}

        {/* Step 3: Liveness */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center justify-center">
              <Activity className="w-6 h-6 mr-2 text-green-400" /> Liveness Detection
            </h2>
            <p className="text-slate-400 text-sm">Please blink naturally while capturing.</p>
            <WebcamCapture onCapture={handleLivenessCapture} buttonText="Verify Liveness" />
            {message && <p className="text-blue-400">{message}</p>}
          </div>
        )}

        {/* Step 4: Gesture */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center justify-center">
              <Hand className="w-6 h-6 mr-2 text-yellow-400" /> Dynamic Challenge
            </h2>
            <p className="text-slate-400 text-sm">Show the following gesture to the camera:</p>
            <div className="bg-slate-900 border border-yellow-500 text-yellow-400 p-3 rounded-lg text-lg font-bold uppercase tracking-wider">
              {challenge}
            </div>
            <WebcamCapture onCapture={handleGestureCapture} buttonText="Verify Gesture" />
            {message && <p className="text-blue-400">{message}</p>}
          </div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <div className="text-center space-y-4 py-8">
            <ShieldCheck className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Access Granted</h2>
            <p className="text-slate-400">Identity verified successfully.</p>
            <button onClick={() => window.location.href = "/dashboard"} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Go to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
