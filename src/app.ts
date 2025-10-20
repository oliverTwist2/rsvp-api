import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db';
import { errorHandler, notFound } from './middlewares/errorHandler';
import adminRoutes from './routes/adminRoutes';
import eventRoutes from './routes/eventRoutes';

const app = express();

connectDB();

app.use(express.json());

//Routes would go here
app.use('/api/admins', adminRoutes);
app.use('/api/events', eventRoutes);

//error handlers
app.use(notFound);
app.use(errorHandler);

export default app;