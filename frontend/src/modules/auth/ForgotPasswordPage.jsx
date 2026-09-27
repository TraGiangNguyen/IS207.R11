import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);

  // Gợi ý tài khoản demo có sẵn để test nhanh
  const demoAccounts = ['admin@gmail.com', 'customer@gmail.com', 'admin@beautypals.com'];

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
      const generatedOtp = res.data?.otp || res.data?.resetToken;

      // 🔔 Pop-up thông báo trực tiếp trên trình duyệt (Browser Native Popup Dialog)
      window.alert(
        `🔔 [THÔNG BÁO XÁC THỰC OTP DEMO]\n\nMã OTP xác thực đặt lại mật khẩu của bạn là: ${generatedOtp}\n\n(Mã có hiệu lực trong vòng 15 phút. Nhấn OK để tiến hành đặt lại mật khẩu).`
      );

      // Tự động chuyển ngay sang màn hình Đặt Lại Mật Khẩu
      navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setErrorMessage(err.message || 'Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Quên Mật Khẩu"
      subtitle="Nhập email để nhận mã xác thực OTP (Demo) đặt lại mật khẩu"
    >
      <form onSubmit={handleSubmit} className="space-y-4.5">
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
          helperText="Nhập email tài khoản để nhận mã xác nhận OTP đặt lại mật khẩu."
          required
        />

        {/* Gợi ý tài khoản demo có sẵn */}
        <div className="p-3 bg-slate-50/90 border border-slate-200 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
            <AlertCircle className="w-3.5 h-3.5 text-beauty-500" />
            <span>Gợi ý tài khoản có sẵn để test nhanh:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => {
                  setEmail(acc);
                  setError('');
                }}
                className="px-2.5 py-1 text-xs bg-white hover:bg-beauty-50 text-slate-700 hover:text-beauty-700 rounded-lg border border-slate-200 hover:border-beauty-300 font-mono transition-all cursor-pointer"
              >
                {acc}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          icon={KeyRound}
        >
          Tạo Mã Xác Thực Đặt Lại
        </Button>

        <div className="text-center pt-1.5">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-beauty-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại màn hình Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
