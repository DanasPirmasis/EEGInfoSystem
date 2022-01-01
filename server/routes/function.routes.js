import express from 'express';
import protect from '../middleware/jwtAuthenticate.js';
import {
	eeg,
	uploadFile,
	uploadHighlights,
} from '../controllers/functionController.js';
import {
	uploadMiddleware,
	downloadMiddleware,
	highlightMiddleware,
} from '../middleware/fileHandler.js';

const router = express.Router();

router.route('/').get(eeg);
router.route('/upload').post(protect, uploadMiddleware, uploadFile);
router
	.route('/uploadHighlights')
	.post(protect, highlightMiddleware, uploadHighlights);
router.route('/download').post(protect, downloadMiddleware);

export default router;
