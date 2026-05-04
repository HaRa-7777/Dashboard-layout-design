import React, { useState, useEffect, createContext, useContext } from 'react';

export type CameraStatus = 'online' | 'offline' | 'warning';

export interface Camera {
  id: string;
  name: string;
  status: CameraStatus;
  lastSeen: string;
  signal: number;
  fps: number;
  preview: string;
  location: { x: number; y: number; name: string };
  logs: Array<{ id: string; time: string; message: string; type: 'error' | 'warning' | 'info' }>;
  fpsHistory: Array<{ time: string; fps: number }>;
}

export interface Alert {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: string;
  cameraId?: string;
  read: boolean;
}

const mockCameras: Camera[] = [
  {
    id: 'cam-01',
    name: 'Front Gate',
    status: 'online',
    lastSeen: 'Just now',
    signal: 98,
    fps: 30,
    preview: 'https://images.unsplash.com/photo-1769103706467-59fca8a0a67d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnRyeSUyMGdhdGUlMjBvdXRzaWRlfGVufDF8fHx8MTc3NzcwNzcwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 20, y: 80, name: 'Main Entrance' },
    logs: [
      { id: 'l1', time: '10:00 AM', message: 'System boot OK', type: 'info' }
    ],
    fpsHistory: Array.from({ length: 20 }).map((_, i) => ({ time: `${i}:00`, fps: 30 }))
  },
  {
    id: 'cam-02',
    name: 'Office Main',
    status: 'online',
    lastSeen: 'Just now',
    signal: 100,
    fps: 30,
    preview: 'https://images.unsplash.com/photo-1658046157053-23e721875df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjByb29tJTIwY2FtZXJhJTIwdmlld3xlbnwxfHx8fDE3Nzc3MDc3MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 50, y: 50, name: 'Office Center' },
    logs: [],
    fpsHistory: Array.from({ length: 20 }).map((_, i) => ({ time: `${i}:00`, fps: 30 }))
  },
  {
    id: 'cam-03',
    name: 'Parking Lot B',
    status: 'offline',
    lastSeen: '10 mins ago',
    signal: 0,
    fps: 0,
    preview: 'https://images.unsplash.com/photo-1765822289050-ef20c0f9a11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJraW5nJTIwbG90JTIwbmlnaHQlMjBjYW1lcmF8ZW58MXx8fHwxNzc3NzA3NzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 80, y: 20, name: 'North Parking' },
    logs: [
      { id: 'l2', time: '14:20 PM', message: 'Connection Lost', type: 'error' }
    ],
    fpsHistory: Array.from({ length: 20 }).map((_, i) => ({ time: `${i}:00`, fps: i > 15 ? 0 : 30 }))
  },
  {
    id: 'cam-04',
    name: 'Warehouse East',
    status: 'warning',
    lastSeen: 'Just now',
    signal: 45,
    fps: 12,
    preview: 'https://images.unsplash.com/photo-1772305336606-989a457ffbae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjB2aWV3JTIwaW5zaWRlfGVufDF8fHx8MTc3NzcwNzcwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 85, y: 70, name: 'Warehouse Sector 2' },
    logs: [
      { id: 'l3', time: '14:28 PM', message: 'High latency detected', type: 'warning' }
    ],
    fpsHistory: Array.from({ length: 20 }).map((_, i) => ({ time: `${i}:00`, fps: i > 10 ? 12 : 30 }))
  },
  {
    id: 'cam-05',
    name: 'Street View North',
    status: 'online',
    lastSeen: 'Just now',
    signal: 85,
    fps: 24,
    preview: 'https://images.unsplash.com/photo-1630241772217-5d4926c594cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjY3R2JTIwc3RyZWV0fGVufDF8fHx8MTc3NzcwNzcwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    location: { x: 30, y: 15, name: 'North Perimeter' },
    logs: [],
    fpsHistory: Array.from({ length: 20 }).map((_, i) => ({ time: `${i}:00`, fps: 24 }))
  },
  {
    id: 'cam-06',
    name: 'Server Room',
    status: 'online',
    lastSeen: 'Just now',
    signal: 100,
    fps: 60,
    preview: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1080',
    location: { x: 60, y: 55, name: 'IT Center' },
    logs: [],
    fpsHistory: Array.from({ length: 20 }).map((_, i) => ({ time: `${i}:00`, fps: 60 }))
  }
];

const mockAlerts: Alert[] = [
  { id: 'a1', message: 'Camera 3 (Parking Lot B) disconnected', type: 'error', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), cameraId: 'cam-03', read: false },
  { id: 'a2', message: 'Low bandwidth detected on Warehouse East', type: 'warning', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), cameraId: 'cam-04', read: false },
  { id: 'a3', message: 'System health check completed successfully', type: 'info', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true },
];

interface DataContextType {
  cameras: Camera[];
  alerts: Alert[];
  serverStatus: 'healthy' | 'degraded' | 'down';
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [serverStatus] = useState<'healthy' | 'degraded' | 'down'>('healthy');

  // Simulate real-time randomness
  useEffect(() => {
    const interval = setInterval(() => {
      setCameras(prev => prev.map(cam => {
        if (cam.status === 'online') {
          // slight fluctuation in fps
          const newFps = Math.max(15, Math.min(60, cam.fps + (Math.random() > 0.5 ? 1 : -1)));
          return { ...cam, fps: newFps };
        }
        return cam;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <DataContext.Provider value={{ cameras, alerts, serverStatus, markAlertRead, markAllAlertsRead }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
