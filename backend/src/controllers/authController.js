import AuthService from '../services/authService.js';

export const AuthController = {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { username, email, password, fullName, role } = req.body;

      if (!username || !email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ các trường: Họ và tên, Username, Email và Mật khẩu.',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự.',
        });
      }

      const result = await AuthService.register({ username, email, password, fullName, role });

      return res.status(201).json({
        success: true,
        message: 'Đăng ký tài khoản thành công!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { account, password } = req.body;

      if (!account || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập tài khoản (Email hoặc Username) và Mật khẩu.',
        });
      }

      const result = await AuthService.login({ account, password });

      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp địa chỉ Email.',
        });
      }

      const result = await AuthService.requestPasswordReset(email);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          resetToken: result.resetToken,
          email: result.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp mã xác nhận (Token) và mật khẩu mới.',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Mật khẩu mới phải có độ dài tối thiểu 6 ký tự.',
        });
      }

      const result = await AuthService.resetPassword({ token, newPassword });

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/profile
   */
  async updateProfile(req, res, next) {
    try {
      const { fullName, avatarUrl } = req.body;
      const updatedUser = await AuthService.updateProfile(req.user.id, { fullName, avatarUrl });
      return res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin hồ sơ thành công!',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/change-password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const result = await AuthService.changePassword(req.user.id, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController;
