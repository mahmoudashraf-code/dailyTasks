import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

import Auth from './pages/Auth.tsx';
import App from './pages/app/Index';
import Tasks from './pages/app/Tasks';
import Home from './pages/app/Home';
import Profile from './pages/app/Profile';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component

import axios from 'axios';

import './index.css';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://127.0.0.1:3000';
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: Auth,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        Component: Home,
      },
      {
        path: 'tasks',
        Component: Tasks,
      },
      {
        path: 'profile',
        Component: Profile,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
);
