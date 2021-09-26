import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';

const protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token) {
		return next(new ErrorResponse('Unauthorized to access this route', 401));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await User.findById(decoded.id);

		if (!user) {
			console.log('No user found with this ID');
			return next(new ErrorResponse('No user found with this ID', 404));
		}

		req.user = user;
		console.log(user);
		next();
	} catch (error) {
		console.log('Token expired');
		console.log(error);
		return next(new ErrorResponse('Unauthorized to access this route', 401));
	}
};

export default protect;
