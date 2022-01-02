import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';
import dotenv from 'dotenv';
import ErrorResponse from '../utils/errorResponse.js';
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

export const uploadMiddleware = (req, res, next) => {
	const upload = store.single('file');

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return next(new ErrorResponse('File too large', 500));
		} else if (err) {
			if (err === 'filetype')
				return next(new ErrorResponse('Only EDF files allowed', 500));
			return new next(ErrorResponse(err, 500));
		}
		next();
	});
};

export const downloadMiddleware = (req, res, next) => {
	try {
		const { id } = req.body;

		if (!id) return next(new ErrorResponse('File id was not provided', 400));

		const _id = new mongoose.Types.ObjectId(id);

		gfs.find({ _id }).toArray((err, files) => {
			if (!files || files.length === 0)
				return next(new ErrorResponse('No files found', 400));
			gfs.openDownloadStream(_id).pipe(res);
		});
	} catch (error) {
		console.error(error);
	}
};

export const highlightMiddleware = (req, res, next) => {
	try {
		const { highlights, fileId, email } = req.body;

		const _id = mongoose.Types.ObjectId(fileId);
		if (!highlights)
			return next(new ErrorResponse('No highlights provided', 400));
		if (!fileId) return next(new ErrorResponse('No File Id provided', 400));
		if (!email) return next(new ErrorResponse('No Email provided', 400));

		gfs.find({ _id }).toArray((err, files) => {
			if (!files || files.length === 0)
				return next(new ErrorResponse('No files found', 400));

			next();
		});
	} catch (error) {
		return next(new ErrorResponse(error, 500));
	}
};

export const deleteMiddleware = () => {
	try {
		const { fileId } = req.body;
		if (!fileId) return next(new ErrorResponse('No File Id provided', 400));

		const _id = mongoose.Types.ObjectId(fileId);

		gfs.delete({ _id }, (error) => {
			if (error) return next(new ErrorResponse('File deletion failed', 500));
			next();
		});
	} catch (error) {}
};
