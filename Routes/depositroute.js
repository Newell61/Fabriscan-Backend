import { Router } from 'express';
import { authenticate, authorize } from '../Middleware/auth.js';
import {
  createDeposit,
  getDonorDeposits,
  getDepositByBarcode,
  getAllDeposits,
} from '../Controllers/depositcontrol.js';

const router = Router();

router.post('/', authenticate, authorize('donor'), createDeposit);

router.get('/me', authenticate, authorize('donor'), getDonorDeposits);

router.get('/history', authenticate, authorize('donor'), getDonorDeposits);

router.get('/:barcode', authenticate, getDepositByBarcode);

router.get('/', authenticate, getAllDeposits);

export default router;