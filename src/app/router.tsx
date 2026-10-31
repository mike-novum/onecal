import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './ui/App';
import { PillsPage } from '@/pages/pills';
import { AlcoholPage, FastfoodPage } from '@/pages/tracker';

export const router = createBrowserRouter(
  [
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
  ],
  { basename: import.meta.env.BASE_URL },
);
