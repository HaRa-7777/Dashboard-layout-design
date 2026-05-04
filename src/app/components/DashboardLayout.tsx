import React, { useState, useEffect } from 'react';
import { useData } from '../store/mockData';
// cache clear
import { Camera, AlertTriangle, ShieldCheck, Activity, Bell, ServerCrash, Clock, Search } from 'lucide-react';

export function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextCheckProgress, setNextCheckProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const healthCheckTimer = setInterval(() => {
      setNextCheckProgress(prev => {
        if (prev <= 0) return 100;
        return prev - (100 / (5 * 60)); // 5 minutes mock
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(healthCheckTimer);
    };
  }, []);

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500/20 p-2 rounded-lg">
          <Camera className="w-6 h-6 text-emerald-500" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          CamHealth
        </h1>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Last Checked: {nextCheckProgress === 100 ? 'Just now' : '2 mins ago'}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500 w-24 text-right">Next in {Math.ceil((nextCheckProgress / 100) * 5)}m</span>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                style={{ width: `${nextCheckProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-800 hidden md:block"></div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="text-sm font-medium">JD</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-500">{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function StatsCards() {
  const { cameras, serverStatus } = useData();

  const total = cameras.length;
  const offline = cameras.filter(c => c.status === 'offline').length;
  const warnings = cameras.filter(c => c.status === 'warning').length;
  const online = cameras.filter(c => c.status === 'online').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">Total Cameras</p>
          <p className="text-2xl font-bold text-white mt-1">{total}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Camera className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Online</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{online}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      <div className="bg-slate-900 border border-red-900/50 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
        <div>
          <p className="text-slate-400 text-sm font-medium">Offline</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-red-500">{offline}</p>
            {offline > 0 && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">Server Status</p>
          <p className="text-lg font-bold text-emerald-400 mt-1 uppercase flex items-center gap-2">
            {serverStatus}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Activity className="w-6 h-6 text-emerald-500" />
        </div>
      </div>
    </div>
  );
}
