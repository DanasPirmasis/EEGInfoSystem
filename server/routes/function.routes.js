import express from 'express';
import protect from '../middleware/jwtAuthenticate.js';
import {
	deleteFile,
	eeg,
	uploadFile,
	uploadHighlights,
} from '../controllers/functionController.js';
import {
	uploadMiddleware,
	downloadMiddleware,
	highlightMiddleware,
	deleteMiddleware,
} from '../middleware/fileHandler.js';

const router = express.Router();

router.route('/').get(eeg);
router.route('/upload').post(protect, uploadMiddleware, uploadFile);
router
	.route('/uploadHighlights')
	.post(protect, highlightMiddleware, uploadHighlights);
router.route('/download').post(protect, downloadMiddleware);
router.route('/deleteFile').delete(protect, deleteMiddleware, deleteFile);

export default router;
