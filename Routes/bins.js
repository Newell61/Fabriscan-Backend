import { Router } from 'express';
import { authenticate, authorize } from '../Middleware/auth.js';
import {
  getBins,
  getBinByBarcode,
  createBin,
  updateBin,
  assignContactToBin,
} from '../Controllers/bincontrol.js';

const router = Router();

router.get('/', authenticate, authorize('admin'), getBins);
router.get('/:barcode', authenticate, authorize('admin'), getBinByBarcode);
router.post('/', authenticate, authorize('admin'), createBin);
router.patch('/:id', authenticate, authorize('admin'), updateBin);
router.patch('/:id/assign-contact', authenticate, authorize('admin'), assignContactToBin);

export default router;
