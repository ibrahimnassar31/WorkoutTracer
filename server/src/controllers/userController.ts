import pkg from 'express';
import { StatusCodes } from 'http-status-codes';
import { signupUser, loginUser, logoutUser } from '../services/userService.ts';
import {  BadRequestError, UnauthenticatedError } from '../errors/custom-api.ts';
import jwt from 'jsonwebtoken';
import config from '../config/index.ts';

const { RequestHandler, Request, Response } = pkg;
const { SignOptions } = jwt;
const signup: RequestHandler = async (req: Request, res: Response) => {
  try {
    const user = await signupUser(req.body);
    res.status(StatusCodes.CREATED).json({ user /*, token */});
    return;
  } catch (error: unknown) {
    if (error instanceof BadRequestError) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
      return;
    }
    let errorMessage = 'An unexpected error occurred during signup.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: errorMessage }); 
    return;
  }
};


const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       throw new Error('Please provide email and password'); 
    }

    const user = await loginUser(email, password);

    const jwtOptions: SignOptions = { expiresIn: config.jwtExpiresIn as string };
    const token = jwt.sign({ userId: user._id, username: user.username }, config.jwtSecret, jwtOptions);

    res.status(StatusCodes.OK).json({ user, token });
    return;

  } catch (error: unknown) {
    if (error instanceof UnauthenticatedError) {
      res.status(StatusCodes.UNAUTHORIZED).json({ msg: error.message });
      return;
    } else if (error instanceof BadRequestError) {
       res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
       return;
    }
    let errorMessage = 'An unexpected error occurred during login.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: errorMessage }); // Generic error response
    return;
  }
};


const logout: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.userId; 

    if (!userId) {
         throw new Error('User not authenticated or user ID not available.');
    }

    await logoutUser(userId); 
    res.status(StatusCodes.OK).json({ msg: 'User logged out successfully' });
    return;

  } catch (error: unknown) {
     let errorMessage = 'An unexpected error occurred during logout.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: errorMessage }); 
    return;
  }
};

export { signup, login, logout }; 