import React from 'react';
import { createBrowserRouter } from "react-router";
import { Dashboard } from './pages/Dashboard';
import { CameraDetail } from './pages/CameraDetail';
import { MapView } from './pages/MapView';
import { DataProvider } from './store/mockData';
// cache clear
import { Outlet } from 'react-router';

function Root() {
  return (
    <DataProvider>
      <Outlet />
    </DataProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "camera/:id", Component: CameraDetail },
      { path: "map", Component: MapView },
    ],
  },
]);
