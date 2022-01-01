import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const HighlightSchema = new mongoose.Schema({
	highlights: [{ signalName: String, valueRange: [Number] }],
	fileId: {
		type: Schema.Types.ObjectId,
		ref: 'edfFiles.files',
	},
	email: {
		type: String,
		required: true,
	},
});

const Highlight = mongoose.model('Highlight', HighlightSchema);
export default Highlight;
