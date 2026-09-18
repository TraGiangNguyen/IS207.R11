import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Alert from '../../components/common/Alert.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Compute Password Strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, label: 'Yếu', color: 'bg-rose-500' };
    if (score <= 4) return { score: 2, label: 'Trung bình', color: 'bg-gold-500' };
    return { score: 3, label: 'Mạnh', color: 'bg-beauty-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên của bạn';
    }
    if (!formData.username.trim()) {
      errs.username = 'Vui lòng chọn tên đăng nhập';
    } else if (formData.username.length < 3) {
      errs.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }
    if (!formData.email.trim()) {
      errs.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Định dạng email không hợp lệ';
    }
    if (!formData.password) {
      errs.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      errs.password = 'Mật khẩu phải từ 6 ký tự trở lên';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Mật khẩu xác nhận không trùng khớp';
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'Bạn cần đồng ý với điều khoản sử dụng';
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
      await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo Tài Khoản"
      subtitle="Bắt đầu trải nghiệm nền tảng quản lý thông minh BeautyPals"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <Alert
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage('')}
          />
        )}

        <Input
          label="Họ và Tên"
          name="fullName"
          type="text"
          placeholder="Nguyễn Văn A"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={User}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tên đăng nhập"
            name="username"
            type="text"
            placeholder="nguyenvana"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            icon={User}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="a@gmail.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
            required
          />
        </div>

        <div>
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

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-2 space-y-1 animate-fade-in">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Độ mạnh mật khẩu:</span>
                <span className="font-bold text-slate-700">{strength.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 h-1.5">
                <div className={`rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                <div className={`rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                <div className={`rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={Lock}
          required
        />

        {/* Agree terms */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-slate-600">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded text-beauty-600 focus:ring-beauty-500 border-slate-300"
            />
            <span>
              Tôi đồng ý với <span className="font-semibold text-beauty-600">Điều khoản sử dụng</span> & <span className="font-semibold text-beauty-600">Chính sách bảo mật</span> của BeautyPals.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-rose-500">{errors.agreeTerms}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          icon={UserPlus}
        >
          Đăng Ký Tài Khoản
        </Button>

        <p className="text-center text-xs text-slate-500 pt-2">
          Đã có tài khoản?{' '}
          <Link
            to="/login"
            className="font-bold text-beauty-600 hover:text-beauty-700 transition-colors"
          >
            Đăng nhập tại đây
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
