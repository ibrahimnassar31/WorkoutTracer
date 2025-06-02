import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  logger.info(`${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.on('finish', () => {
    const durationInNano = process.hrtime(start);
    const durationInMs = (durationInNano[0] * 1e9 + durationInNano[1]) / 1e6;

    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Math.round(durationInMs)}ms`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationInMs),
    });
  });

  next(); 
};

export default requestLogger; 