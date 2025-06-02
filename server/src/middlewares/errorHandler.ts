import { Request, Response,  } from 'express';
import logger from '../utils/logger.js'; // Import logger

// Define an interface for custom errors
interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response) => {
  // Log the error details
  // Using logger.error to ensure it goes to error-specific transports (like error.log)
  logger.error(`Error: ${err.message}`, {
    stack: err.stack, // Log stack trace for debugging
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode: err.statusCode || 500, // Use the custom interface property
    // Add other relevant request details if needed
  });

  // Determine the status code
  const statusCode = err.statusCode || 500;

  // Send error response to the client
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred',
    // In development, you might send the stack trace back, but avoid in production
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Optionally, if you have other error handlers down the chain
  // next(err);
};

export default errorHandler; 