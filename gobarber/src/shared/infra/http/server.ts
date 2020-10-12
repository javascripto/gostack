import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import { errors } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import routes from './routes';
import rateLimiter from './middlewares/RateLimiterMiddleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());
app.use((error: Error, request: Request, response: Response, _: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }
  // eslint-disable-next-line no-console
  console.error(error);
  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('🚀️ Server started on port 3333');
});
