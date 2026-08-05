import { Router } from 'express';
import { authenticate, authorize } from '../Middleware/auth.js';
import {
  createCollection,
  getVolunteerCollections,
  getPendingCollections,
  approveCollection,
  disputeCollection,
} from '../Controllers/collectioncontrol.js';

const router = Router();

router.post('/', authenticate, authorize('volunteer'), createCollection);
router.get('/me', authenticate, authorize('volunteer'), getVolunteerCollections);
router.get('/pending', authenticate, authorize('site_contact'), getPendingCollections);
router.patch('/:id/approve', authenticate, authorize('site_contact'), approveCollection);
router.patch('/:id/dispute', authenticate, authorize('site_contact'), disputeCollection);

export default router;
