import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import dotenv from 'dotenv';
import ErrorResponse from '../utils/errorResponse.js';
import crypto from 'crypto';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

let gfs;
conn.once('open', () => {
	gfs = new mongoose.mongo.GridFSBucket(conn.db, {
		bucketName: 'edfFiles',
	});
});

const storage = new GridFsStorage({
	url: mongoURI,
	options: { useUnifiedTopology: true },
	file: (req, file) => {
		const fileInfo = {
			filename: file.originalname,
			bucketName: 'edfFiles',
		};
		return fileInfo;
	},
});

const store = multer({
	storage,
	limits: { fileSize: 200000000 },
	fileFilter: (req, file, callback) => {
		const ext = path.extname(file.originalname);
		if (ext !== '.edf') {
			return callback('filetype');
		}
		callback(null, true);
	},
});

const uploadMiddleware = (req, res, next) => {
	const upload = store.single('file');

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return next(new ErrorResponse('File too large'));
		} else if (err) {
			if (err === 'filetype')
				return next(new ErrorResponse('Only EDF files allowed'));
			return new ErrorResponse(err);
		}
		next();
		conn.close();
	});
};

export default uploadMiddleware;
