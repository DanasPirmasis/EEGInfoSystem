import express from 'express';
import protect from '../middleware/jwtAuthenticate.js';
import { eeg, physicalSignals } from '../controllers/eegRoutes.js';
const router = express.Router();

//router.route('/').get(protect, (req, res) => res.send('Hello World'));
router.route('/physicalSignals').get(physicalSignals);
//router.route('/recordingInfo').get(recordingInfo);
router.route('/').get(eeg);
export default router;
