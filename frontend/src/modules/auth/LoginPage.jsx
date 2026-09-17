import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Alert from '../../components/common/Alert.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    account: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fromPath = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const errs = {};
    if (!formData.account.trim()) {
      errs.account = 'Vui lòng nhập Email hoặc Tên đăng nhập';
    }
    if (!formData.password) {
      errs.password = 'Vui lòng nhập Mật khẩu';
    } else if (formData.password.length < 6) {
      errs.password = 'Mật khẩu phải từ 6 ký tự trở lên';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(formData.account, formData.password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo fill for test convenience
  const fillDemoAccount = () => {
    setFormData({
      account: 'admin@beautypals.com',
      password: 'Admin@123',
      rememberMe: true,
    });
    setErrors({});
    setErrorMessage('');
  };

  return (
    <AuthLayout
      title="Đăng Nhập"
      subtitle="Nhập thông tin tài khoản để truy cập hệ thống BeautyPals"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        )}

        <Input
          label="Tài khoản"
          name="account"
          type="text"
          placeholder="email@example.com hoặc username"
          value={formData.account}
          onChange={handleChange}
          error={errors.account}
          icon={Mail}
          required
        />

        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded text-beauty-600 focus:ring-beauty-500 border-slate-300"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-semibold text-beauty-600 hover:text-beauty-700 transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          icon={LogIn}
        >
          Đăng Nhập
        </Button>

        {/* Demo Quick Fill Box in Teal & Gold */}
        <div className="pt-2 border-t border-slate-100">
          <div className="p-3 bg-beauty-50/60 rounded-2xl border border-beauty-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-beauty-900 font-medium">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span>Tài khoản Demo Admin:</span>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-xs font-bold text-beauty-700 hover:text-beauty-900 bg-white px-2.5 py-1 rounded-lg border border-beauty-200 shadow-xs transition-all cursor-pointer"
            >
              Tự điền nhanh
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 pt-2">
          Chưa có tài khoản BeautyPals?{' '}
          <Link
            to="/register"
            className="font-bold text-beauty-600 hover:text-beauty-700 transition-colors"
          >
            Đăng ký tài khoản mới
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
