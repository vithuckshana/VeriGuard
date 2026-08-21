"use client";

import React from 'react';
import ContinuousVerifier from '@/components/ContinuousVerifier';
import { ShieldCheck, Users, Activity, Lock, AlertOctagon } from 'lucide-react';

export default function DashboardPage() {
  const mockLogs = [
    { id: 1, time: "10:45 AM", event: "Login Success", user: "admin_user", status: "success" },
    { id: 2, time: "10:50 AM", event: "Liveness Failed", user: "jdoe", status: "danger" },
    { id: 3, time: "11:05 AM", event: "Gesture Failed (Open Palm)", user: "asmith", status: "warning" },
    { id: 4, time: "11:15 AM", event: "Unauthorized Face Detected", user: "admin_user", status: "danger" },
    { id: 5, time: "11:20 AM", event: "Session Locked", user: "admin_user", status: "warning" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <ContinuousVerifier />
      
      <header className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <div className="flex items-center">
          <ShieldCheck className="w-10 h-10 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold tracking-tight">VeriGuard Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">Welcome, Admin</span>
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
            <p className="text-2xl font-bold">24</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <Activity className="w-10 h-10 text-green-400 mr-4" />
          <div>
            <p className="text-slate-400 text-sm">Successful Logins</p>
            <p className="text-2xl font-bold">142</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <Lock className="w-10 h-10 text-yellow-400 mr-4" />
          <div>
            <p className="text-slate-400 text-sm">Locked Sessions</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center">
          <AlertOctagon className="w-10 h-10 text-red-400 mr-4" />
          <div>
            <p className="text-slate-400 text-sm">Security Alerts</p>
            <p className="text-2xl font-bold">7</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Recent Security Events</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">User</th>
              <th className="p-4">Event</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                <td className="p-4 text-slate-300">{log.time}</td>
                <td className="p-4 font-medium">{log.user}</td>
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
