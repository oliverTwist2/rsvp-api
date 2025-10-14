import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db';
import { errorHandler, notFound } from './middlewares/errorHandler';

const app = express();

connectDB();

app.use(express.json());

//Routes would go here

//error handlers
app.use(notFound);
app.use(errorHandler);

export default app;