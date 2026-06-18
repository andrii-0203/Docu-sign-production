import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DocumentView from './pages/DocumentView';
import GuestSign from './pages/GuestSign';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'text-sm font-medium',
                style: {
                  background: 'var(--toast-bg, #fff)',
                  color: 'var(--toast-color, #1e293b)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                },
                success: { iconTheme: { primary: '#4f46e5', secondary: '#fff' } },
                error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
              }}
            />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/sign/:token" element={<GuestSign />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/documents/:id" element={<DocumentView />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
