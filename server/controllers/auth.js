import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import sanitize from 'mongo-sanitize';

export const register = async (req, res, next) => {
	const username = sanitize(req.body.username);
	const email = sanitize(req.body.email);
	const password = sanitize(req.body.password);

	try {
		const user = await User.create({
			username,
			email,
			password,
		});
		console.log('aaa');
		sendToken(user, 200, res);
	} catch (error) {
		next(error);
	}
};

export const login = async (req, res, next) => {
	const email = sanitize(req.body.email);
	const password = sanitize(req.body.password);

	if (!email || !password) {
		return next(new ErrorResponse('Please provide email and password', 400));
	}

	try {
		const user = await User.findOne({ email }).select('+password');

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
};

const sendToken = (user, statusCode, res) => {
	const token = user.getSignedToken();
	res.status(statusCode).json({ success: true, token });
};
