import pkg from 'express';import jwt from 'jsonwebtoken';
import config from '../config/index.ts'; 
import { UnauthenticatedError } from '../errors/custom-api.ts';
import logger from '../utils/logger.ts';

const { Request, Response, NextFunction } = pkg;

interface JwtPayload {
  userId: string;
  username: string;
}


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Authentication Invalid - No token provided or incorrect format');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;


    req.user = { userId: payload.userId, username: payload.username };

    next();
  } catch (error: unknown) {
    
    if (error instanceof Error) {
        logger.error(`JWT Verification Error: ${error.message}`, { stack: error.stack, token });
    } else {
        logger.error('Unknown JWT Verification Error', { error, token });
    }
    
    throw new UnauthenticatedError('Authentication Invalid - Token verification failed');
  }
};

export default authMiddleware; 