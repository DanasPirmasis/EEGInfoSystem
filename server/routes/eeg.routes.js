import express from 'express';
import protect from '../middleware/jwtAuthenticate.js';

const router = express.Router();

router.route('/').get(protect, (req, res) => res.send('Hello World'));

export default router;
