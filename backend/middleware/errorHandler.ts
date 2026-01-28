import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (err.code === 11000) {
    // Duplicate key error
    statusCode = 400;
    message = 'Duplicate entry found';
  } else if (err.status) {
    statusCode = err.status;
  }

  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};