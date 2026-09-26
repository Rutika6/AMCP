import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getMyProfile,
  updateProfile,
  linkGithub,
  updateSkills,
} from '../controllers/profileController.js';

const router = express.Router();

router.use(protect);
router.get('/me', getMyProfile);
router.put('/me', updateProfile);
router.post('/link-github', linkGithub);
router.put('/skills', updateSkills);

export default router;
