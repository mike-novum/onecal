import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { AlcoholPage } from './pages/AlcoholPage';
import { FastfoodPage } from './pages/FastfoodPage';
import { PillsPage } from './pages/PillsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/alcohol" replace /> },
      { path: 'alcohol', element: <AlcoholPage /> },
      { path: 'pills', element: <PillsPage /> },
      { path: 'fastfood', element: <FastfoodPage /> },
    ],
  },
]);
