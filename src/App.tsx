
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';

// Lazy load pages
const Index = React.lazy(() => import('@/pages/Index'));
const Login = React.lazy(() => import('@/pages/Login'));
const AdminLogin = React.lazy(() => import('@/pages/AdminLogin'));
const OwnerLogin = React.lazy(() => import('@/pages/OwnerLogin'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('@/pages/ResetPassword'));
const PendingApproval = React.lazy(() => import('@/pages/PendingApproval'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/Dashboard'));
const OwnerDashboard = React.lazy(() => import('@/pages/owner/Dashboard'));

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: 'admin' | 'establishment_owner' | 'fire_inspector'; 
}) => {
  // This is a placeholder. The actual implementation will use useAuth
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/owner-login" element={<OwnerLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pending" element={<PendingApproval />} />
            
            {/* Protected routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute requiredRole="establishment_owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
