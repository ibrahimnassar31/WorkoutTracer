import express from 'express';
import config from './config/index.ts';
import connectDB from './config/db.ts'; 
import setupMiddleware from './middlewares/index.ts'; 
import errorHandler from './middlewares/errorHandler.ts';
import userRoute from './routes/userRoutes.ts';
const app = express();

// Connect Database & Redis
connectDB(); 

setupMiddleware(app); 

// Define API Routes
app.use('/api/users', userRoute);


app.get('/', (_req, res) => {
  res.send('workout tracer  API is running!');
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.env} mode`);
}); 