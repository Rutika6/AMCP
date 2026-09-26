import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
  getMyTeams,
  searchTeams,
} from '../controllers/teamController.js';
import { applyToTeam, getRequestsForTeam } from '../controllers/requestController.js';

const router = express.Router();

router.use(protect);

// Specific routes must come before the /:teamId catch-all
router.get('/mine', getMyTeams);
router.get('/search', searchTeams);

router.post('/', createTeam);
router.get('/:teamId', getTeamById);
router.put('/:teamId', updateTeam);
router.delete('/:teamId', deleteTeam);

// Join requests nested under a team (US-13, US-14, US-15)
router.post('/:teamId/requests', applyToTeam);
router.get('/:teamId/requests', getRequestsForTeam);

export default router;
