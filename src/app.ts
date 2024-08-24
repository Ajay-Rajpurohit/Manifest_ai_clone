import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import routes from './routes';
import cors from "cors";
import mongoose from "mongoose";
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000/', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', "OPTIONS"], 
  credentials: true,
};

app.use(cors(corsOptions));

// Use the routes
app.use('/api', routes);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


// Basic root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Express API with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(401).send('Unauthenticated!');
});

