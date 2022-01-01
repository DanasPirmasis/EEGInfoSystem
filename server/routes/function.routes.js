import express from 'express';
import protect from '../middleware/jwtAuthenticate.js';
import { eeg, uploadFile } from '../controllers/functionController.js';
import uploadMiddleware from '../middleware/fileHandler.js';

const router = express.Router();

router.route('/').get(eeg);
router.route('/upload').post(protect, uploadMiddleware, uploadFile);

export default router;
