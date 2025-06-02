import express from 'express';
import config from './config/index.ts';
import connectDB from './config/db.ts'; 
import {connectRedis} from './config/redis.ts'; 
import setupMiddleware from './middlewares/index.ts'; 
import errorHandler from './middlewares/errorHandler.ts';

const app = express();

// Connect Database & Redis
connectDB(); 
connectRedis();

setupMiddleware(app); 

// Define API Routes



app.get('/', (_req, res) => {
  res.send('Number Guessing Game API is running!');
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.env} mode`);
}); 