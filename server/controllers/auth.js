import { create, findOne } from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import sanitize from 'mongo-sanitize';

export async function register(req, res, next) {
	const username = sanitize(req.body.username);
	const email = sanitize(req.body.email);
	const password = sanitize(req.body.password);

	try {
		const user = await create({
			username,
			email,
			password,
		});
	} catch (error) {
		next(error);
	}
}

export async function login(req, res, next) {
	const email = sanitize(req.body.email);
	const password = sanitize(req.body.password);

	if (!email || !password) {
		return next(
			new ErrorResponse('Please provide email and password', 400)
		);
	}

	try {
		const user = await findOne({ email }).select('+password');

		if (!user) {
			return next(new ErrorResponse('Invalid credentials', 401));
		}

		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return next(new ErrorResponse('Invalid credentials', 401));
		}

		sendToken(user, 201, res);
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
}
