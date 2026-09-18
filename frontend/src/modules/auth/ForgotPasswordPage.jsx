import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Alert from '../../components/common/Alert.jsx';
import authService from '../../services/authService.js';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email của bạn');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Định dạng email không hợp lệ');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setError('');

    try {
      const res = await authService.forgotPassword(email);
      setSuccessInfo({
        message: res.message || 'Yêu cầu đặt lại mật khẩu đã được xử lý.',
        resetToken: res.data?.resetToken,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Không thể xử lý yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên Mật Khẩu"
      subtitle="Đừng lo lắng! Hãy nhập email để nhận mã xác thực đặt lại mật khẩu"
    >
      {successInfo ? (
        <div className="space-y-6 text-center animate-fade-in py-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">
              Yêu cầu đã được gửi!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              {successInfo.message}
            </p>
          </div>

          {/* Test / Dev Convenience Token Box */}
          {successInfo.resetToken && (
            <div className="p-4 bg-beauty-50/70 border border-beauty-200 rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-beauty-900">
                <KeyRound className="w-4 h-4 text-beauty-500" />
                <span>Mã đặt lại mật khẩu (Token):</span>
              </div>
              <p className="font-mono text-xs bg-white p-2.5 rounded-xl border border-beauty-200 text-slate-700 break-all select-all">
                {successInfo.resetToken}
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                fullWidth
                icon={ArrowRight}
                onClick={() => navigate(`/reset-password?token=${successInfo.resetToken}`)}
              >
                Tiến hành Đặt lại Mật khẩu ngay
              </Button>
            </div>
          )}

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-beauty-600 hover:text-beauty-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <Alert
              type="error"
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />
          )}

          <Input
            label="Địa chỉ Email đã đăng ký"
            name="email"
            type="email"
            placeholder="nhap-email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            icon={Mail}
            helperText="Chúng tôi sẽ gửi liên kết và mã xác thực bảo mật tới hòm thư của bạn."
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            icon={KeyRound}
          >
            Gửi Yêu Cầu Đặt Lại
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-beauty-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại màn hình Đăng nhập
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
