import React from 'react';
import { useData, Camera as CameraType } from '../store/mockData';
// cache clear
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Wifi, WifiOff, Clock, Activity, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CameraGrid() {
  const { cameras } = useData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cameras.map(camera => (
        <CameraCard key={camera.id} camera={camera} />
      ))}
    </div>
  );
}

function CameraCard({ camera }: { camera: CameraType }) {
  const isOffline = camera.status === 'offline';
  const isWarning = camera.status === 'warning';

  return (
    <Link to={`/camera/${camera.id}`} className="block h-full group">
      <motion.div 
        whileHover={{ y: -2 }}
        className={clsx(
          "relative bg-slate-900 rounded-xl overflow-hidden border transition-all duration-300 h-full flex flex-col",
          isOffline ? "border-red-500/50" : isWarning ? "border-yellow-500/50" : "border-slate-800 hover:border-slate-600"
        )}
      >
        {/* Live Preview Area */}
        <div className="relative aspect-video bg-black overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={camera.preview}
            alt={camera.name}
            className={clsx(
              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
              isOffline && "grayscale opacity-50"
            )}
          />
          
          {/* Overlay Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className={clsx(
              "px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs font-semibold shadow-lg backdrop-blur-md",
              isOffline ? "bg-red-500/90 text-white" : 
              isWarning ? "bg-yellow-500/90 text-yellow-950" : 
              "bg-black/60 text-emerald-400 border border-white/10"
            )}>
              {isOffline ? (
                <>
                  <WifiOff className="w-3 h-3" />
                  OFFLINE
                </>
              ) : isWarning ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  DELAY
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </>
              )}
            </div>
          </div>

          {/* FPS & Signal Overlay */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3 h-3" />
              {camera.fps} FPS
            </div>
          </div>

          {/* Disconnected Error State Overlay */}
          {isOffline && (
            <div className="absolute inset-0 bg-red-950/40 flex flex-col items-center justify-center backdrop-blur-[2px]">
              <AlertTriangle className="w-10 h-10 text-red-500 mb-2 animate-bounce" />
              <span className="text-white font-bold text-sm tracking-wider uppercase bg-red-500/80 px-3 py-1 rounded-full">
                Camera Offline
              </span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-200 text-lg leading-tight truncate">{camera.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Last seen: {camera.lastSeen}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Wifi className="w-3.5 h-3.5" />
              Signal: {camera.signal}%
            </div>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={clsx(
                  "h-full rounded-full",
                  camera.signal > 70 ? "bg-emerald-500" : camera.signal > 30 ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ width: `${camera.signal}%` }}
              />
            </div>
          </div>
        </div>

        {/* Warning/Offline Pulse border effect */}
        {isOffline && (
          <div className="absolute inset-0 border-2 border-red-500 rounded-xl animate-pulse pointer-events-none" />
        )}
      </motion.div>
    </Link>
  );
}
