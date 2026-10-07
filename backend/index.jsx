import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import alertsRouter from './routes/alerts.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Main Alerts Route Register
app.use('/api/alerts', alertsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});