import React, { useState } from 'react';
import { useData } from '../store/mockData';
// cache clear
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertCircle, Info, TriangleAlert, X, CheckCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

export function AlertPanel() {
  const { alerts, markAlertRead, markAllAlertsRead } = useData();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredAlerts = alerts.filter(a => filter === 'all' || !a.read).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="bg-slate-900 border-l border-slate-800 h-[calc(100vh-4rem)] flex flex-col sticky top-16 w-full md:w-80 shrink-0">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-300" />
          <h2 className="font-semibold text-white">Alerts</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAlertsRead}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3 h-3" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex p-2 gap-1 border-b border-slate-800/50">
        <button
          onClick={() => setFilter('all')}
          className={clsx(
            "flex-1 text-xs py-1.5 rounded-md font-medium transition-colors",
            filter === 'all' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-300"
          )}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={clsx(
            "flex-1 text-xs py-1.5 rounded-md font-medium transition-colors",
            filter === 'unread' ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-300"
          )}
        >
          Unread
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-8 text-slate-500 text-sm"
            >
              No alerts found.
            </motion.div>
          ) : (
            filteredAlerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={clsx(
                  "p-3 rounded-lg border text-sm relative group transition-colors",
                  alert.read ? "bg-slate-800/20 border-slate-800" : 
                  alert.type === 'error' ? "bg-red-500/10 border-red-500/20" : 
                  alert.type === 'warning' ? "bg-yellow-500/10 border-yellow-500/20" : 
                  "bg-blue-500/10 border-blue-500/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {alert.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {alert.type === 'warning' && <TriangleAlert className="w-4 h-4 text-yellow-500" />}
                    {alert.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex-1 pr-4">
                    <p className={clsx(
                      "font-medium leading-tight mb-1",
                      alert.read ? "text-slate-300" : "text-slate-100"
                    )}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  {!alert.read && (
                    <button 
                      onClick={() => markAlertRead(alert.id)}
                      className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-slate-400 hover:text-white transition-all bg-slate-800 rounded-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {!alert.read && alert.type === 'error' && (
                  <div className="absolute top-0 left-0 w-full h-full border border-red-500/30 rounded-lg animate-pulse pointer-events-none" />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
