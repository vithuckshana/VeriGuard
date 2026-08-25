"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Camera, Activity, Hand, CheckCircle, Loader2 } from 'lucide-react';
import WebcamCapture from '@/components/WebcamCapture';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [challenge, setChallenge] = useState('Open Palm');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setMessage("Verifying Google account...");
    try {
      const res = await axios.post("http://localhost:8000/auth/google-login", {
        credential: credentialResponse.credential
      });
      setUsername(res.data.username);
      
      const gestures = ["Open Palm", "Closed Fist", "Peace Sign", "Thumbs Up"];
      setChallenge(gestures[Math.floor(Math.random() * gestures.length)]);
      
      setMessage("");
      setStep(2);
    } catch (err) {
      setMessage("Google Authentication failed. Please try again.");
    }
    setLoading(false);
  };

  const handleFaceCapture = async (imageSrc: string) => {
    setLoading(true);
    setMessage("Verifying face geometry with MediaPipe...");
    try {
      await axios.post("http://localhost:8000/auth/verify-face", { username, image: imageSrc });
      setMessage("");
      setStep(3);
    } catch (err) {
      setMessage("Failed to detect face. Please try again.");
    }
    setLoading(false);
  };

  const handleLivenessCapture = async (imageSrc: string) => {
    setLoading(true);
    setMessage("Checking liveness...");
    try {
      await axios.post("http://localhost:8000/auth/verify-liveness", { username, image: imageSrc });
      setMessage("");
      setStep(4);
    } catch (err) {
      setMessage("Liveness check failed. Please look straight at the camera.");
    }
    setLoading(false);
  };

  const handleGestureCapture = async (imageSrc: string) => {
    setLoading(true);
    setMessage(`Verifying gesture: ${challenge}...`);
    try {
      await axios.post("http://localhost:8000/auth/verify-gesture", { username, image: imageSrc, challenge: challenge });
      setMessage("Authentication Successful!");
      setStep(5);
    } catch (err) {
      setMessage(`Failed to detect ${challenge}. Please make the gesture clearly visible.`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-500/20 p-4 rounded-full mb-4">
            <ShieldCheck className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">VeriGuard Login</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">Zero-Trust Multimodal Authentication</p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.includes('fail') || message.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {message}
          </div>
        )}

        {/* STEP 1: Google OAuth */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 text-blue-400 mb-6 border-b border-slate-700 pb-4">
              <User className="w-5 h-5" />
              <span className="font-semibold tracking-wide">STEP 1: GOOGLE ACCOUNT</span>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-slate-300 text-center text-sm">Please sign in with your Google Account to begin the secure authentication process.</p>
              {loading ? (
                <div className="flex justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setMessage('Google Login Failed');
                  }}
                  useOneTap
                />
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account? <a href="/register" className="text-blue-400 hover:underline">Register with Google</a>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Face */}
        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center justify-center">
              <Camera className="w-6 h-6 mr-2 text-blue-400" /> Face Verification
            </h2>
            <p className="text-slate-400 text-sm">Please position your face clearly in the frame.</p>
            <WebcamCapture onCapture={handleFaceCapture} buttonText="Verify Face" />
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
