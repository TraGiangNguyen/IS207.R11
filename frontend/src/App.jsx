import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./modules/auth/LoginPage.jsx";
import RegisterPage from "./modules/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./modules/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./modules/auth/ResetPasswordPage.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import MainLayout from "./components/Layout/MainLayout.jsx";
import Dashboard from "./modules/dashboard/Dashboard.jsx";
import ProductCatalogPage from "./pages/ProductCatalogPage.jsx";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Main Layout chứa chung Sidebar và Header cho cả 2 trang */}
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
        {/* Đưa ProductCatalog vào đây để dùng chung Layout */}
        <Route path="products" element={<ProductCatalogPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}

export default App;
