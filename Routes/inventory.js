import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getInventory, confirmInventory } from '../controllers/inventorycontrol.js';

const router = Router();

router.get('/', authenticate, authorize('sorting_team_head', 'admin'), getInventory);
router.patch('/:id/confirm', authenticate, authorize('sorting_team_head', 'admin'), confirmInventory);

export default router;