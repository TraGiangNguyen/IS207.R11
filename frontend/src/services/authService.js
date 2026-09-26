import api from './api.js';

export const authService = {
  /**
   * Đăng nhập tài khoản
   */
  async login(credentials) {
    return api.post('/auth/login', credentials);
  },

  /**
   * Đăng ký tài khoản mới
   */
  async register(data) {
    return api.post('/auth/register', data);
  },

  /**
   * Yêu cầu link/mã quên mật khẩu
   */
  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  /**
   * Đặt lại mật khẩu mới qua token
   */
  async resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  /**
   * Lấy thông tin cá nhân hiện tại
   */
  async getProfile() {
    return api.get('/auth/me');
  },

  /**
   * Cập nhật thông tin hồ sơ
   */
  async updateProfile(profileData) {
    return api.put('/auth/profile', profileData);
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(passwordData) {
    return api.put('/auth/change-password', passwordData);
  },
};

export default authService;
