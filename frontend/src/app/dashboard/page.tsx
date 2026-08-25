"use client";

import React from 'react';
import ContinuousVerifier from '@/components/ContinuousVerifier';
import { ShieldCheck, Users, Activity, Lock, AlertOctagon } from 'lucide-react';

export default function DashboardPage() {
  const mockLogs = [
    { id: 1, time: "08:42:15 AM", user: "sarah.jenkins@corp.com", event: "Login Success", location: "New York, USA", ip: "192.158.1.38", status: "success" },
    { id: 2, time: "08:45:33 AM", user: "m.rodriguez@corp.com", event: "Continuous Verification Failed", location: "Austin, USA", ip: "10.4.22.109", status: "danger" },
    { id: 3, time: "09:12:05 AM", user: "david.chen@corp.com", event: "Gesture Challenge Failed (Peace Sign)", location: "London, UK", ip: "82.13.29.11", status: "warning" },
    { id: 4, time: "09:30:45 AM", user: "j.smith@corp.com", event: "Liveness Check Failed (Spoofing Attempt)", location: "Unknown (Proxy)", ip: "145.22.1.99", status: "danger" },
    { id: 5, time: "09:31:02 AM", user: "j.smith@corp.com", event: "Account Locked (Multiple Biometric Failures)", location: "Unknown (Proxy)", ip: "145.22.1.99", status: "warning" },
    { id: 6, time: "10:14:22 AM", user: "emily.stark@corp.com", event: "Login Success", location: "Berlin, DE", ip: "99.14.55.2", status: "success" },
    { id: 7, time: "10:28:19 AM", user: "a.patel@corp.com", event: "Unauthorized Face Detected (Session Locked)", location: "Chicago, USA", ip: "10.8.44.201", status: "danger" },
    { id: 8, time: "11:05:40 AM", user: "alex.williams@corp.com", event: "Gesture Challenge Failed (Closed Fist)", location: "Seattle, USA", ip: "65.22.19.4", status: "warning" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <ContinuousVerifier />
      
      <header className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <div className="flex items-center">
          <ShieldCheck className="w-10 h-10 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold tracking-tight">VeriGuard Enterprise Security</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">Welcome, System Admin</span>
          <button onClick={() => window.location.href="/login"} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-sm border border-slate-600">
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <Users className="w-10 h-10 text-blue-400 mr-4" />
          <div>
            <p className="text-slate-400 text-sm">Active Sessions</p>
            <p className="text-2xl font-bold">1,284</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <Activity className="w-10 h-10 text-green-400 mr-4" />
          <div>
            <p className="text-slate-400 text-sm">Successful Logins (24h)</p>
            <p className="text-2xl font-bold">8,492</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <Lock className="w-10 h-10 text-yellow-400 mr-4" />
          <div>
            <p className="text-slate-400 text-sm">Locked Sessions (24h)</p>
            <p className="text-2xl font-bold">23</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <AlertOctagon className="w-10 h-10 text-red-400 mr-4" />
          <div>
            <p className="text-slate-400 text-sm">Security Alerts (24h)</p>
            <p className="text-2xl font-bold">47</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Real-Time Security Events</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">User</th>
              <th className="p-4">Location / IP</th>
              <th className="p-4">Event</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="p-4 text-slate-300 text-sm">{log.time}</td>
                <td className="p-4 font-medium">{log.user}</td>
                <td className="p-4">
                  <div className="text-sm">{log.location}</div>
                  <div className="text-xs text-slate-400">{log.ip}</div>
                </td>
                <td className="p-4 text-slate-300">{log.event}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    log.status === 'success' ? 'bg-green-500/20 text-green-400' :
                    log.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {log.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
