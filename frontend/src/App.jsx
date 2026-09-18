import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/LoginPage.jsx';
import RegisterPage from './modules/auth/RegisterPage.jsx';
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './modules/auth/ResetPasswordPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import MainLayout from './components/Layout/MainLayout.jsx';
import Dashboard from './modules/dashboard/Dashboard.jsx';

export function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
