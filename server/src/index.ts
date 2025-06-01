import express from 'express';
import config from './config/index.ts';
import connectDB from './config/db.ts'; 
// import connectRedis from './config/redis'; 
// import setupMiddleware from './middlewares'; 
// import apiRoutes from './api'; 

const app = express();

// Connect Database & Redis
connectDB(); 
// connectRedis();

// Setup Middleware (Security, Logging, Rate Limiting, etc.)
// setupMiddleware(app); 

// Define API Routes
// app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
  res.send('Number Guessing Game API is running!');
});

// Global Error Handling Middleware (will implement later)
// app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.env} mode`);
}); 