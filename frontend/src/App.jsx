import { Routes, Route, Navigate } from "react-router-dom";

// Import các trang xác thực (Auth)
import LoginPage from "./modules/auth/LoginPage.jsx";
import RegisterPage from "./modules/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./modules/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./modules/auth/ResetPasswordPage.jsx";

// Import Layout và components bảo vệ
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import MainLayout from "./components/Layout/MainLayout.jsx";

// Import các trang chức năng (Modules/Pages)
import Dashboard from "./modules/dashboard/Dashboard.jsx";
import ProductCatalogPage from "./pages/ProductCatalogPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CartPage from "./pages/CartPage.jsx"; // Bổ sung trang Giỏ hàng

import { useAuth } from "./context/AuthContext.jsx";

// Component điều hướng mặc định theo Role
function IndexRoute() {
  const { user } = useAuth();
  return <Navigate to={user?.role === "customer" ? "/products" : "/dashboard"} replace />;
}

export function App() {
  return (
    <Routes>
      {/* 1. Nhóm Route Public (Không cần đăng nhập) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 2. Nhóm Route Private (Yêu cầu đăng nhập - Bọc bởi ProtectedRoute và MainLayout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Điều hướng mặc định: Customer vào /products, Admin vào /dashboard */}
        <Route index element={<IndexRoute />} />
        
        {/* Dashboard chỉ dành cho Admin và Staff */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "staff"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route path="products" element={<ProductCatalogPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 3. Catch-all Route (Bắt các đường dẫn không tồn tại và đẩy về trang danh sách sản phẩm) */}
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}

export default App;
