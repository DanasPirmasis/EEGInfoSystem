import express from 'express';
import protect from '../middleware/jwtAuthenticate.js';
import {
	deleteFile,
	eeg,
	getHighlights,
	uploadFile,
	uploadHighlights,
} from '../controllers/functionController.js';
import {
	uploadMiddleware,
	downloadMiddleware,
	highlightMiddleware,
	getHightlightMiddleware,
	deleteMiddleware,
} from '../middleware/fileHandler.js';

const router = express.Router();

router.route('/').get(eeg);
router.route('/upload').post(protect, uploadMiddleware, uploadFile);
router
	.route('/uploadHighlights')
	.post(protect, highlightMiddleware, uploadHighlights);
router.route('/getHighlights').get(getHightlightMiddleware, getHighlights);
router.route('/download').get(downloadMiddleware);
router.route('/deleteFile').delete(protect, deleteMiddleware, deleteFile);

export default router;
