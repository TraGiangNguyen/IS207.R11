import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserModel from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'beautypals_jwt_secret_key_2026_super_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Helper to generate JWT Token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Format user output (strip sensitive fields)
 */
function formatUserResponse(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.full_name || user.fullName,
    role: user.role,
    avatarUrl: user.avatar_url || user.avatarUrl,
    createdAt: user.created_at,
  };
}

export const AuthService = {
  /**
   * Register a new user
   */
  async register({ username, email, password, fullName, role = 'customer' }) {
    // 1. Check if email already exists
    const existingEmail = await UserModel.findByEmail(email);
    if (existingEmail) {
      const error = new Error('Email này đã được sử dụng.');
      error.statusCode = 409;
      throw error;
    }

    // 2. Check if username already exists
    const existingUsername = await UserModel.findByUsername(username);
    if (existingUsername) {
      const error = new Error('Tên người dùng này đã tồn tại.');
      error.statusCode = 409;
      throw error;
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create in DB
    const userId = await UserModel.create({
      username,
      email,
      passwordHash,
      fullName,
      role,
    });

    // 5. Retrieve created user
    const newUser = await UserModel.findById(userId);
    const token = generateToken(newUser);

    return {
      user: formatUserResponse(newUser),
      token,
    };
  },

  /**
   * Login with email or username
   */
  async login({ account, password }) {
    if (!account || !password) {
      const error = new Error('Vui lòng nhập tài khoản và mật khẩu.');
      error.statusCode = 400;
      throw error;
    }

    // Check if account is email or username
    let user = await UserModel.findByEmail(account);
    if (!user) {
      user = await UserModel.findByUsername(account);
    }

    if (!user) {
      const error = new Error('Tài khoản hoặc mật khẩu không chính xác.');
      error.statusCode = 401;
      throw error;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Tài khoản hoặc mật khẩu không chính xác.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);

    return {
      user: formatUserResponse(user),
      token,
    };
  },

  /**
   * Generate Reset Password Token
   */
  async requestPasswordReset(email) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      // Don't leak user existence for security, or return standard response
      return {
        message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi.',
        resetToken: null,
      };
    }

    // Generate random token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await UserModel.setResetToken(user.id, resetToken, expiresAt);

    return {
      message: 'Yêu cầu đặt lại mật khẩu thành công. Vui lòng sử dụng mã/token được cấp để đổi mật khẩu.',
      resetToken, // Returned for dev/test flow
      email: user.email,
    };
  },

  /**
   * Reset Password with Token
   */
  async resetPassword({ token, newPassword }) {
    if (!token || !newPassword) {
      const error = new Error('Token và mật khẩu mới không được để trống.');
      error.statusCode = 400;
      throw error;
    }

    const user = await UserModel.findByResetToken(token);
    if (!user) {
      const error = new Error('Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
      error.statusCode = 400;
      throw error;
    }

    // Check token expiry
    if (user.reset_token_expires_at && new Date() > new Date(user.reset_token_expires_at)) {
      const error = new Error('Mã đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu mã mới.');
      error.statusCode = 400;
      throw error;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await UserModel.updatePassword(user.id, newPasswordHash);

    return {
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.',
    };
  },

  /**
   * Get Current Profile by User ID
   */
  async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('Không tìm thấy thông tin người dùng.');
      error.statusCode = 404;
      throw error;
    }
    return formatUserResponse(user);
  },

  /**
   * Update Profile Details (fullName, avatarUrl)
   */
  async updateProfile(userId, { fullName, avatarUrl }) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('Không tìm thấy thông tin người dùng.');
      error.statusCode = 404;
      throw error;
    }

    const updatedFullName = fullName !== undefined ? fullName : user.full_name;
    const updatedAvatarUrl = avatarUrl !== undefined ? avatarUrl : user.avatar_url;

    await UserModel.updateProfile(userId, {
      fullName: updatedFullName,
      avatarUrl: updatedAvatarUrl,
    });

    const updatedUser = await UserModel.findById(userId);
    return formatUserResponse(updatedUser);
  },

  /**
   * Change Password with Current Password Verification
   */
  async changePassword(userId, { currentPassword, newPassword, confirmPassword }) {
    if (!currentPassword || !newPassword) {
      const error = new Error('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.');
      error.statusCode = 400;
      throw error;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      const error = new Error('Mật khẩu mới và mật khẩu xác nhận không trùng khớp.');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      error.statusCode = 400;
      throw error;
    }

    const user = await UserModel.findByIdWithPassword(userId);
    if (!user) {
      const error = new Error('Không tìm thấy người dùng.');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      const error = new Error('Mật khẩu hiện tại không chính xác.');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    await UserModel.updatePassword(userId, newPasswordHash);

    return {
      message: 'Đổi mật khẩu thành công!',
    };
  },
};

export default AuthService;
