import express from 'express';
import { login, logout, register, verifyToken } from '../controllers/authController';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken);
router.post('/logout', logout);
export default router;
//# sourceMappingURL=authRoutes.js.map