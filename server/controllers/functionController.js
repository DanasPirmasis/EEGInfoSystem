import fs from 'fs';
import edfdecoder from 'edfdecoder';
import ErrorResponse from '../utils/errorResponse.js';

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
		const { file } = req;
		const { id } = file;

		res.status(200).json({
			success: true,
			id: id,
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};
