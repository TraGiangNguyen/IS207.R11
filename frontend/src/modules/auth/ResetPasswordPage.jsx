import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, KeyRound, CheckCircle2, ArrowLeft, RefreshCw, Mail, ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Alert from '../../components/common/Alert.jsx';
import authService from '../../services/authService.js';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [targetEmail, setTargetEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    if (urlEmail) {
      setTargetEmail(urlEmail);
    }
  }, [searchParams]);

  // Countdown timer for Resend OTP button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const validateForm = () => {
    const errs = {};
    if (!formData.token.trim()) {
      errs.token = 'Vui lòng nhập mã xác thực OTP (6 chữ số)';
    } else if (formData.token.trim().length !== 6 && formData.token.trim().length < 4) {
      errs.token = 'Mã OTP không hợp lệ';
    }

    if (!formData.newPassword) {
      errs.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      errs.newPassword = 'Mật khẩu mới phải từ 6 ký tự trở lên';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (errorMessage) setErrorMessage('');
  };

  const handleResendOtp = async () => {
    if (!targetEmail) {
      setErrorMessage('Không có email để gửi lại mã. Vui lòng quay lại trang Quên Mật Khẩu.');
      return;
    }

    setIsResending(true);
    setErrorMessage('');

    try {
      const res = await authService.forgotPassword(targetEmail);
      const newOtp = res.data?.otp || res.data?.resetToken;
      
      // Pop-up alert trên browser khi gửi lại OTP
      window.alert(
        `🔔 [MÃ OTP MỚI]\n\nMã xác thực OTP mới của bạn là: ${newOtp}\n\n(Vui lòng ghi nhớ mã và nhập vào ô bên dưới).`
      );

      setCountdown(60);
    } catch (err) {
      setErrorMessage(err.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      await authService.resetPassword(formData.token.trim(), formData.newPassword);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || 'Không thể đặt lại mật khẩu. Mã OTP có thể không chính xác hoặc đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Đặt Lại Mật Khẩu"
      subtitle="Thiết lập mật khẩu mới an toàn cho tài khoản của bạn"
    >
      {isSuccess ? (
        <div className="space-y-6 text-center animate-fade-in py-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">
              Đổi Mật Khẩu Thành Công!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Mật khẩu mới của bạn đã được cập nhật an toàn. Bây giờ bạn có thể đăng nhập ngay với mật khẩu mới.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            icon={ShieldCheck}
            onClick={() => navigate('/login')}
          >
            Đăng Nhập Ngay
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {targetEmail && (
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <Mail className="w-4 h-4 text-beauty-600 shrink-0" />
              <span>
                Đang đặt lại cho: <strong className="text-slate-800 font-semibold">{targetEmail}</strong>
              </span>
            </div>
          )}

          {errorMessage && (
            <Alert
              type="error"
              message={errorMessage}
              onClose={() => setErrorMessage('')}
            />
          )}

          <div className="space-y-1.5">
            <Input
              label="Mã xác thực OTP (6 chữ số)"
              name="token"
              type="text"
              placeholder="Nhập 6 chữ số OTP từ pop-up"
              value={formData.token}
              onChange={handleChange}
              error={errors.token}
              icon={KeyRound}
              maxLength={6}
              className="font-mono text-center tracking-widest text-lg font-bold"
              required
            />
            {targetEmail && (
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={countdown > 0 || isResending}
                  onClick={handleResendOtp}
                  className="text-xs font-semibold text-beauty-600 hover:text-beauty-700 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                  {countdown > 0 ? `Gửi lại mã sau (${countdown}s)` : 'Gửi lại mã OTP'}
                </button>
              </div>
            )}
          </div>

          <Input
            label="Mật khẩu mới"
            name="newPassword"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            icon={Lock}
            required
          />

          <Input
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            icon={CheckCircle2}
          >
            Lưu Mật Khẩu Mới
          </Button>

          <div className="flex items-center justify-center gap-3 pt-2 text-xs">
            <Link
              to="/forgot-password"
              className="font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Yêu cầu mã mới
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-beauty-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại Đăng nhập
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
