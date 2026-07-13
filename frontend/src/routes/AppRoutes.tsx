import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// Lazy loading or direct imports of pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import WorkspacePage from '../pages/WorkspacePage';
import HistoryPage from '../pages/HistoryPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import ProfilePage from '../pages/ProfilePage';
import AdminPage from '../pages/AdminPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Admin Route requires both auth AND admin status */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
