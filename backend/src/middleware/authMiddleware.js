import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'beautypals_jwt_secret_key_2026_super_secure';

/**
 * Middleware to verify JWT Access Token
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Truy cập bị từ chối. Vui lòng cung cấp mã xác thực (Token).',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    });
  }
}

/**
 * Middleware for Role-based Access Control (e.g., admin, staff)
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này.',
      });
    }
    next();
  };
}

export default {
  authenticateToken,
  requireRole,
};
