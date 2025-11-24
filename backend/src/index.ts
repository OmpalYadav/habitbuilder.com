import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import pino from 'pino';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import habitRoutes from './routes/habits';
import entryRoutes from './routes/entries';

dotenv.config();

const app = express();
const logger = pino();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/entries', entryRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
