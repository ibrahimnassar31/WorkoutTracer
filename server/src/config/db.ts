import mongoose from 'mongoose';
import config from './index.ts';
import logger from '../utils/logger.ts';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri,
    {
        maxPoolSize: 50, 
        minPoolSize: 5, 
        serverSelectionTimeoutMS: 30000,
    }
    );
    logger.info('MongoDB Connected...');
  } catch (err) {
    logger.error('MongoDB connection failed:', (err as Error).message);
    process.exit(1);
  }
};

export default connectDB; 