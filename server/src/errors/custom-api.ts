import { StatusCodes } from 'http-status-codes';


export class CustomAPIError extends Error {
  statusCode: number;


  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomAPIError.prototype);
  }
}


export class BadRequestError extends CustomAPIError {
 
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}


export class UnauthenticatedError extends CustomAPIError {
 
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }
}

