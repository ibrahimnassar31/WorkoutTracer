import User from '../models/User.ts';
import   IUser  from '../models/User.ts'
import {  UnauthenticatedError } from '../errors/custom-api.ts'; // Assuming custom error classes
import mongoose from 'mongoose'; 
import config from '../config/index.ts'; 

interface SignupData {
  username: IUser['username'];
  email: IUser['email'];
  password: string; 
}

interface UserProfile {
  _id: string; 
  username: string;
  email: string;
  createdAt: Date;
}


const signupUser = async (userData: SignupData): Promise<UserProfile> => {
  const existingUser = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] });
  if (existingUser) {

    throw new Error('User with that email or username already exists'); 
  }

  const user = await User.create({
    username: userData.username,
    email: userData.email,
    password_hash: userData.password, 
  });

  const userObject = user.toObject();

  const userProfile: UserProfile = {
    _id: (userObject._id as mongoose.Types.ObjectId).toString(), 
    username: userObject.username,
    email: userObject.email,
    createdAt: userObject.createdAt,
  };

  return userProfile;
};


const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  const user = await User.findOne({ email }).select('+password_hash');

  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const userObject = user.toObject();

  const userProfile: UserProfile = {
    _id: (userObject._id as mongoose.Types.ObjectId).toString(), 
    username: userObject.username,
    email: userObject.email,
    createdAt: userObject.createdAt,
  };

  return userProfile;
};


const logoutUser = async (userId: string): Promise<void> => {
 
};

export { signupUser, loginUser , logoutUser }; 