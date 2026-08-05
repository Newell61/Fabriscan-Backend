import { Router } from 'express';
import { authenticate, authorize } from '../Middleware/auth.js';
import {
  createDistributions,
  getMyDistributions,
  signOffDistribution,
} from '../Controllers/distributionController.js';

const router = Router();

router.post('/', authenticate, authorize('sorting_team_head'), createDistributions);
router.get('/me', authenticate, authorize('org_rep'), getMyDistributions);
router.patch('/:id/signoff', authenticate, authorize('org_rep'), signOffDistribution);

export default router;
