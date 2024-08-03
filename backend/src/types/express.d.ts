import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust the type based on what you store in req.user
    }
  }
}
