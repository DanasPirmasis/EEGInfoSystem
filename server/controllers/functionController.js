import fs from 'fs';
import edfdecoder from 'edfdecoder';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import Highlight from '../models/Highlight.js';

export const eeg = async (req, res, next) => {
	var buffer = fs.readFileSync(
		'C:/Users/alisa/Desktop/Bakalauras/studentams_v6/0_Suzymeti_Pikai/0_EEG_Piku_Zymejimui/bac 2016.08.16. RE T4 t3.edf'
	).buffer;

	var decoder = new edfdecoder.EdfDecoder();
	decoder.setInput(buffer);
	decoder.decode();
	var output = decoder.getOutput();
	res.status(200).send(output.getPhysicalSignal(0, 0));
};

export const uploadFile = async (req, res, next) => {
	try {
		const { email } = req.body;
		const { file } = req;
		const { id } = file;

		const _id = mongoose.Types.ObjectId(id);

		if (!email)
			return next(new ErrorResponse('User mail was not provided', 400));

		await User.updateOne({ email: email }, { $push: { fileIds: _id } });

		res.status(200).json({
			success: true,
			id: id,
		});
	} catch (error) {
		return next(new ErrorResponse(error, 500));
	}
};

export const uploadHighlights = async (req, res, next) => {
	try {
		let { highlights, fileId, email } = req.body;

		fileId = mongoose.Types.ObjectId(fileId);

		await Highlight.create({
			highlights: highlights,
			fileId: fileId,
			email: email,
		});

		res.status(200).json({ success: true });
	} catch (error) {
		console.log(error);
		return next(new ErrorResponse(error, 500));
	}
};

export const getHighlights = async (req, res, next) => {
	try {
		const { id } = req.query;

		const _id = new mongoose.Types.ObjectId(id);
		/*
		[
  {
    _id: new ObjectId("61d471c91bb34244354d5d04"),
    highlights: [ [Object] ],
    fileId: new ObjectId("61d471c41bb34244354d5c7a"),
    email: 'nedalape@gmail.com',
    __v: 0
  },
  {
    _id: new ObjectId("61d471cd1bb34244354d5d08"),
    highlights: [ [Object], [Object] ],
    fileId: new ObjectId("61d471c41bb34244354d5c7a"),
    email: 'nedalape@gmail.com',
    __v: 0
  }
]
example

		*/
		const data = await Highlight.find({ fileId: _id });
		let highlightArray = [];
		data.forEach((datum) => {
			datum.highlights.forEach((highlight) =>
				highlightArray.push({
					signalName: highlight.signalName,
					valueRange: highlight.valueRange,
				})
			);
		});

		res.status(200).json({ highlights: highlightArray });
	} catch (error) {
		return next(new ErrorResponse(error, 500));
	}
};

export const deleteFile = async (req, res, next) => {
	try {
		const { id } = req.query;

		const _id = mongoose.Types.ObjectId(id);

		await Highlight.deleteMany({ fileId: _id });

		await User.updateOne({ fileIds: _id }, { $pull: { fileIds: _id } });

		res.status(200).json({ success: true, fileId: id });
	} catch (error) {
		console.log(error);
		return next(new ErrorResponse(error, 500));
	}
};

export const getUserData = async (req, res, next) => {
	try {
		const { email } = req.query;

		if (!email) {
			return next(new ErrorResponse('Please provide email', 400));
		}

		const user = await User.findOne({ email });

		if (!user) {
			return next(new ErrorResponse('User not found', 401));
		}

		res.status(200).json({ email: user.email, fileIds: user.fileIds });
	} catch (error) {
		return next(new ErrorResponse(error, 500));
	}
};
