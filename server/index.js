import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import eegRouter from './routes/function.routes.js';
import authRoutes from './routes/auth.routes.js';
import connectDB from './db.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();

app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
	})
);
app.use(express.json({ limit: 1000000 }));
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/', eegRouter);
app.use('/api/auth', authRoutes);
app.use('*', (req, res) => res.status(404).json({ error: 'Not Found' }));

app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
