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

export const deleteFile = () => {
	const { fileId } = req.body;

	res.status(200).json({ success: true, fileId: fileId });
};
