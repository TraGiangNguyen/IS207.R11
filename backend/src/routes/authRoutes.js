import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes
router.get('/me', authenticateToken, AuthController.getMe);
router.put('/profile', authenticateToken, AuthController.updateProfile);
router.put('/change-password', authenticateToken, AuthController.changePassword);

export default router;
