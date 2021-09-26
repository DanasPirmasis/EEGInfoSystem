import { Router } from 'express';
const router = Router();

import { register, login } from '../controllers/auth';

router.route('/register').post(register);

router.route('/login').post(login);

export default router;
