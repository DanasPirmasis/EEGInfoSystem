import { randomBytes, createHash } from 'crypto';
import { Schema as _Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';
const Schema = _Schema;

const UserSchema = new _Schema({
	username: {
		type: String,
		maxlength: [20, 'Username is too long'],
		required: [true, 'Please provide a username'],
	},
	email: {
		type: String,
		required: [true, 'Please provide an email'],
		unique: true,
		match: [
			/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/,
			'Please provide a valid email',
		],
		maxlength: [64, 'Email is too long'],
	},
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		maxlength: [64, 'Password is too long'],
		select: false,
	},
	resetPasswordToken: String,
	resetPaswordExpire: Date,
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await genSalt(10);
	this.password = await hash(this.password, salt);
	next();
});

UserSchema.methods.matchPassword = async function (password) {
	return await compare(password, this.password);
};

const User = model('User', UserSchema);

export default User;
