import React, { useState } from 'react';
import { TopBar, StatsCards } from '../components/DashboardLayout';
import { useData } from '../store/mockData';
// cache clear
import { AlertPanel } from '../components/AlertPanel';
import { Map as MapIcon, LayoutGrid, Navigation, AlertTriangle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

export function MapView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cameras } = useData();
  const [hoveredCam, setHoveredCam] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative flex flex-col">
          <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col">
            <StatsCards />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-emerald-500" />
                Facility Map Overview
              </h2>
              
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                <Link 
                  to="/" 
                  className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    location.pathname === '/' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
                </Link>
                <Link 
                  to="/map" 
                  className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                    location.pathname === '/map' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                  )}
                >
                  <MapIcon className="w-4 h-4" />
                  Map
                </Link>
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 min-h-[500px] bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
              {/* Mock Blueprint Background */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>
              
              {/* Mock Building Outlines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-700/50 fill-slate-800/20" strokeWidth="2">
                <rect x="15%" y="10%" width="30%" height="80%" rx="8" />
                <rect x="55%" y="10%" width="35%" height="40%" rx="8" />
                <rect x="55%" y="60%" width="35%" height="30%" rx="8" />
                <path d="M45% 50% L 55% 50%" strokeDasharray="4 4" />
              </svg>

              <div className="absolute inset-0 p-8">
                {cameras.map(cam => {
                  const isOffline = cam.status === 'offline';
                  const isWarning = cam.status === 'warning';
                  
                  return (
                    <div 
                      key={cam.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${cam.location.x}%`, top: `${cam.location.y}%` }}
                      onMouseEnter={() => setHoveredCam(cam.id)}
                      onMouseLeave={() => setHoveredCam(null)}
                      onClick={() => navigate(`/camera/${cam.id}`)}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.2 }}
                        className={clsx(
                          "relative cursor-pointer w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 z-10 transition-colors",
                          isOffline ? "bg-red-950 border-red-500 text-red-500" :
                          isWarning ? "bg-yellow-950 border-yellow-500 text-yellow-500" :
                          "bg-emerald-950 border-emerald-500 text-emerald-500"
                        )}
                      >
                        <Navigation className="w-4 h-4 transform rotate-45" />
                        
                        {/* Pulse effect for offline/warning */}
                        {(isOffline || isWarning) && (
                          <span className={clsx(
                            "absolute inset-0 rounded-full animate-ping opacity-75",
                            isOffline ? "bg-red-500" : "bg-yellow-500"
                          )}></span>
                        )}
                      </motion.div>

                      <AnimatePresence>
                        {hoveredCam === cam.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white rounded-lg shadow-xl border border-slate-700 z-50 overflow-hidden pointer-events-none"
                          >
                            <div className="h-24 bg-black relative">
                              <img src={cam.preview} alt={cam.name} className={clsx("w-full h-full object-cover", isOffline && "grayscale opacity-50")} />
                              {isOffline && (
                                <div className="absolute inset-0 flex items-center justify-center bg-red-950/50">
                                  <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4 className="font-semibold text-sm truncate">{cam.name}</h4>
                              <p className="text-xs text-slate-400 mt-1">{cam.location.name}</p>
                              <div className="mt-2 flex items-center justify-between text-xs">
                                <span className={clsx(
                                  isOffline ? "text-red-400" : isWarning ? "text-yellow-400" : "text-emerald-400"
                                )}>
                                  {cam.status.toUpperCase()}
                                </span>
                                <span className="text-slate-500">{cam.fps} FPS</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
                <h4 className="text-sm font-semibold text-white mb-1">Map Legend</h4>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-emerald-950"></div>
                  Online
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-4 h-4 rounded-full border-2 border-yellow-500 bg-yellow-950 relative">
                    <span className="absolute inset-0 rounded-full animate-ping bg-yellow-500 opacity-50"></span>
                  </div>
                  Warning
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-red-950 relative">
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-50"></span>
                  </div>
                  Offline
                </div>
              </div>
            </div>
          </div>
        </main>

        <AlertPanel />
      </div>
    </div>
  );
}
