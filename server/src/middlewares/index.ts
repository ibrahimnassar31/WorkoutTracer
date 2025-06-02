import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from '../utils/logger.ts';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

const morganStream = {
    write: (message: string) => logger.info(message.trim()),
};

const setupMiddleware = (app:any) => {
    app.use(helmet());

    const corsOptions = {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    };
    app.use(cors(corsOptions));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(morgan('combined', { stream: morganStream }));

    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again after 15 minutes',
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use('/api/', apiLimiter);

    app.use(compression());
};

export default setupMiddleware;