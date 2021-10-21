import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import eegRouter from './routes/eeg.routes.js';
import authRoutes from './routes/auth.routes.js';
import connectDB from './db.js';

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
//Cors makes the server inaccessible

app.use('/api/v1/', eegRouter);
app.use('/api/auth', authRoutes);
app.use('*', (req, res) => res.status(404).json({ error: 'Not Found' }));

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});
