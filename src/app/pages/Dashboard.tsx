import React from 'react';
import { StatsCards, TopBar } from '../components/DashboardLayout';
import { CameraGrid } from '../components/CameraGrid';
import { AlertPanel } from '../components/AlertPanel';
import { Map, LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { clsx } from 'clsx';

export function Dashboard() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            <StatsCards />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-emerald-500" />
                Live Camera Feeds
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
                  <Map className="w-4 h-4" />
                  Map
                </Link>
              </div>
            </div>

            <CameraGrid />
          </div>
        </main>

        {/* Alert Sidebar */}
        <AlertPanel />
      </div>
    </div>
  );
}
