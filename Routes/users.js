import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deactivateUser,
} from '../controllers/userController.js';

const router = Router();

router.post('/', authenticate, authorize('admin'), createUser);
router.get('/', authenticate, authorize('admin'), getUsers);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.patch('/:id', authenticate, authorize('admin'), updateUser);
router.patch('/:id/deactivate', authenticate, authorize('admin'), deactivateUser);

export default router;
