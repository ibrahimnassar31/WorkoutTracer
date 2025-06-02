import pkg from 'express';

import logger from '../utils/logger.ts';
import config from '../config/index.ts';
import { StatusCodes } from 'http-status-codes';

const { Request, Response } = pkg;
interface HandledError extends Error {
    statusCode?: number;
    code?: number; 
    keyValue?: unknown; 
    errors?: unknown; 
}


const errorHandlerMiddleware = (err: HandledError, req: Request, res: Response): void => {

  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  });

  const customError: { statusCode: number; msg: string } = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  };


  //  Handling Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const validationErrors = err.errors as any; 
    customError.msg = Object.values(validationErrors)
      .map((item: any) => item.message)
      .join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Handling Mongoose Duplicate Key Errors
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue as any)[0]; 
    const duplicateValue = (err.keyValue as any)[duplicateField];
    customError.msg = `Duplicate value entered for ${duplicateField}: ${duplicateValue}, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }





  // Determine the response message based on the environment.
  // In production, hide internal server error details from the client.
  const responseMessage = config.env === 'production' && customError.statusCode === StatusCodes.INTERNAL_SERVER_ERROR
    ? 'Something went wrong, try again later'
    : customError.msg;

  // Send the error response to the client.
  res.status(customError.statusCode).json({ msg: responseMessage });
};

export default errorHandlerMiddleware;