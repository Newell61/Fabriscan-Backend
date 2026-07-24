import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createOrganisation,
  getOrganisations,
  approveOrganisation,
  rejectOrganisation,
  suspendOrganisation,
} from '../controllers/orgController.js';

const router = Router();

router.post('/', authenticate, authorize('admin'), createOrganisation);
router.get('/', authenticate, authorize('admin', 'sorting_team_head', 'org_rep'), getOrganisations);
router.patch('/:id/approve', authenticate, authorize('admin'), approveOrganisation);
router.patch('/:id/reject', authenticate, authorize('admin'), rejectOrganisation);
router.patch('/:id/suspend', authenticate, authorize('admin'), suspendOrganisation);

export default router;
