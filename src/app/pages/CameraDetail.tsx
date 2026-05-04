import React from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useData } from '../store/mockData';
// cache clear
import { ArrowLeft, Activity, Clock, Wifi, AlertTriangle, Settings, Maximize2 } from 'lucide-react';
import { TopBar } from '../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function CameraDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cameras } = useData();
  
  const camera = cameras.find(c => c.id === id);

  if (!camera) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <h2 className="text-2xl font-bold mb-4">Camera Not Found</h2>
        <button onClick={() => navigate('/')} className="text-emerald-500 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isOffline = camera.status === 'offline';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      <TopBar />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  {camera.name}
                  <span className={clsx(
                    "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5",
                    isOffline ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                    camera.status === 'warning' ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                    "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  )}>
                    {!isOffline && <span className={clsx("w-2 h-2 rounded-full animate-pulse", camera.status === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500')} />}
                    {camera.status}
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Last seen: {camera.lastSeen}</span>
                  <span className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5" /> Signal: {camera.signal}%</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative group">
                <div className="aspect-video bg-black relative">
                  <ImageWithFallback 
                    src={camera.preview} 
                    alt={camera.name}
                    className={clsx(
                      "w-full h-full object-cover",
                      isOffline && "grayscale opacity-30"
                    )}
                  />
                  {isOffline && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
                      <h2 className="text-2xl font-bold text-white mb-2">Connection Lost</h2>
                      <p className="text-slate-400">Unable to reach camera stream</p>
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  {!isOffline && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-mono text-white">REC</span>
                      <span className="text-slate-400 mx-2">|</span>
                      <span className="text-sm font-mono text-white">{new Date().toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* FPS Graph */}
              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  Performance Metrics (FPS)
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={camera.fpsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 65]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area type="monotone" dataKey="fps" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-4">Device Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Location</span>
                    <span className="text-slate-200 font-medium">{camera.location.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">IP Address</span>
                    <span className="text-slate-200 font-mono text-sm">192.168.1.{camera.id.replace('cam-0', '')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Model</span>
                    <span className="text-slate-200">VisorCam X4</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Uptime</span>
                    <span className="text-slate-200">99.8%</span>
                  </div>
                </div>
              </div>

              {/* Logs */}
              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex-1">
                <h3 className="text-lg font-semibold text-white mb-4">System Logs</h3>
                {camera.logs.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">No recent logs</div>
                ) : (
                  <div className="space-y-3">
                    {camera.logs.map(log => (
                      <div key={log.id} className="flex gap-3 text-sm">
                        <span className="text-slate-500 font-mono shrink-0">{log.time}</span>
                        <span className={clsx(
                          "flex-1",
                          log.type === 'error' ? 'text-red-400' :
                          log.type === 'warning' ? 'text-yellow-400' :
                          'text-slate-300'
                        )}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
