import express from 'express';
import { protect } from '../middleware/auth.js';
import { respondToRequest, getMyApplications } from '../controllers/requestController.js';

const router = express.Router();

router.use(protect);

router.get('/mine', getMyApplications);
router.put('/:requestId', respondToRequest);

export default router;
