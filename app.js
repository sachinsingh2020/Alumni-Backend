import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ErrorMiddleware from './middlewares/Error.js';

config({
    path: "./config/config.env",
})

const app = express();

// middleware 
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// importing and using routes 
import user from "./routes/userRoutes.js"

app.use('/api/v1', user);

// printing server is working 
app.get('/', (req, res) => {
    res.send('Server is working');
})

export default app;

app.use(ErrorMiddleware);