import { Router } from 'express';
import { authenticate, authorize } from '../Middleware/auth.js';
import { getInventory, confirmInventory } from '../Controllers/inventorycontrol.js';

const router = Router();

router.get('/', authenticate, authorize('sorting_team_head', 'admin'), getInventory);
router.patch('/:id/confirm', authenticate, authorize('sorting_team_head', 'admin'), confirmInventory);

export default router;