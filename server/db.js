import mongoose from 'mongoose';

const connectDB = async () => {
	await mongoose.connect(process.env.MONGO_URI, {
		wtimeoutMS: 5000,
	});

	console.log('MongoDB connected');
};

export default connectDB;
