import fs from 'fs';
import edfdecoder from 'edfdecoder';
import sizeof from 'object-sizeof';

export const eeg = async (req, res, next) => {
	var buffer = fs.readFileSync(
		'C:/Users/alisa/Desktop/Bakalauras/studentams_v6/0_Suzymeti_Pikai/0_EEG_Piku_Zymejimui/bac 2016.08.16. RE T4 t3.edf'
	).buffer;

	var decoder = new edfdecoder.EdfDecoder();
	decoder.setInput(buffer);
	decoder.decode();
	var output = decoder.getOutput();

	console.log(output.getRecordDuration());
	console.log(output.getRecordingID());
	console.log(output.getNumberOfRecords());
	console.log(output.getNumberOfSignals());
	console.log(output.getPatientID());
	console.log(output.getRecordingStartDate());
	console.log(output.getSignalDigitalMax(0));
	console.log(output.getSignalDigitalMin(0));
	console.log(output.getSignalPhysicalMax(0));
	console.log(output.getSignalPhysicalMin(0));
	console.log(output.getSignalPrefiltering(0));
	console.log(output.getSignalTransducerType(0));
	console.log(output.getSignalSamplingFrequency(0));
	console.log(output.getReservedField(2));
	//console.log(output.getPhysicalSignal(0, 0));
	// console.log(output.getRawSignal(0, 0));
	//console.log(output.getPhysicalSignalConcatRecords(0, 1, 1));

	res.status(200).send(output.getPhysicalSignal(0, 0));
};

export const physicalSignals = (req, res, next) => {
	//send as blob rather than json
	try {
		var buffer = fs.readFileSync(
			'C:/Users/alisa/Desktop/Bakalauras/studentams_v6/0_Suzymeti_Pikai/0_EEG_Piku_Zymejimui/bac 2016.08.16. RE T4 t3.edf'
		).buffer;

		var decoder = new edfdecoder.EdfDecoder();
		decoder.setInput(buffer);
		decoder.decode();
		var output = decoder.getOutput();

		let finalResponse = [];
		const numberOfRecords = output.getNumberOfRecords();
		const numberOfSignals = output.getNumberOfSignals();
		const start = new Date();
		// let response = [];
		// for (let i = 0; i < numberOfRecords; i++) {
		// 	let signal = output.getPhysicalSignal(0, i);
		// 	response.push(signal);
		// }
		for (let j = 0; j < numberOfSignals; j++) {
			let response = [];
			for (let i = 0; i < numberOfRecords; i++) {
				let signal = output.getPhysicalSignal(j, i);
				response.push(signal);
			}
			finalResponse.push(response);
		}

		const timeTaken = new Date() - start;
		res.status(200).send(finalResponse);
		console.log(timeTaken);
		console.log(sizeof(response));
	} catch (err) {
		console.log(err);
	}
};
