"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Camera, CheckCircle, Loader2 } from 'lucide-react';
import WebcamCapture from '@/components/WebcamCapture';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setMessage("Creating VeriGuard profile with Google...");
    try {
      const res = await axios.post("http://localhost:8000/auth/google-login", {
        credential: credentialResponse.credential
      });
      setUsername(res.data.username);
      setMessage("Profile created! Let's capture your baseline face geometry.");
      setStep(2);
    } catch (err) {
      setMessage("Failed to register with Google.");
    }
    setLoading(false);
  };

  const handleFaceCapture = async (imageSrc: string) => {
    setLoading(true);
    setMessage("Mapping face geometry and saving baseline...");
    try {
      // For registration, we hit the same verify endpoint as a mock for now
      await axios.post("http://localhost:8000/auth/verify-face", { username, image: imageSrc });
      setMessage("");
      setStep(3);
    } catch (err) {
      setMessage("Failed to detect face. Please try again.");
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
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
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
              <span className="font-semibold tracking-wide">STEP 1: GOOGLE PROFILE</span>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-slate-300 text-center text-sm">Register your enterprise account using your Google identity.</p>
              {loading ? (
                <div className="flex justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setMessage('Google Registration Failed');
                  }}
                />
              )}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account? <a href="/login" className="text-blue-400 hover:underline">Sign In</a>
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Face Baseline */}
        {step === 2 && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center justify-center">
              <Camera className="w-6 h-6 mr-2 text-blue-400" /> Baseline Registration
            </h2>
            <p className="text-slate-400 text-sm">We need to map your face to enable biometric logins.</p>
            <WebcamCapture onCapture={handleFaceCapture} buttonText="Save Face Data" />
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Registration Complete</h2>
            <p className="text-slate-400">Your biometric profile has been securely saved.</p>
            <button onClick={() => window.location.href = "/login"} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Proceed to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
