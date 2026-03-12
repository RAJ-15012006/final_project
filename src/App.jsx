import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LayoutProvider } from './context/LayoutContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemArea from './pages/ProblemArea';
import MainLayout from './components/MainLayout';
import { ConfigProvider, theme as antdTheme } from 'antd';
import './App.css';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main App routing component
function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/problems" 
        element={
          <ProtectedRoute>
            <MainLayout><Problems /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/coding-room" 
        element={
          <ProtectedRoute>
            <MainLayout><Problems /></MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/problem/:id" 
        element={
          <ProtectedRoute>
            <ProblemArea />
          </ProtectedRoute>
        } 
      />
      {/* Redirect root based on auth status */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// App wrapper with Providers
export default function App() {
  return (
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  );
}

function AppWrapper() {
  const { theme } = useTheme();
  
  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#00f2ff',
          colorBgBase: '#000000',
          colorTextBase: '#ffffff',
          borderRadius: 12,
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          wireframe: false,
        },
        components: {
          Button: {
            colorPrimary: '#00f2ff',
            colorLink: '#00f2ff',
            colorLinkHover: '#bc13fe',
          },
          Table: {
            colorBgContainer: 'transparent',
            colorHeaderBg: 'rgba(0, 242, 255, 0.05)',
          }
        }
      }}
    >
      <AuthProvider>
        <ProgressProvider>
          <LayoutProvider>
            <Router>
              <AppContent />
            </Router>
          </LayoutProvider>
        </ProgressProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}