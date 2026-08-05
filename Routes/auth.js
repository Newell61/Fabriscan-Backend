import { Router } from 'express';
import { login, getMe } from '../Controllers/authController.js';
import { authenticate } from '../Middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;