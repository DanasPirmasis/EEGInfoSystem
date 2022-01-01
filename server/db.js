import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			wtimeoutMS: 5000,
		});
		console.log('MongoDB connected');
	} catch (error) {
		console.error(error);
	}
};

export default connectDB;
