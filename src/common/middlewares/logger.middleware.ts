import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // Clone body to avoid mutating the original
    const safeBody = { ...req.body };

    // Remove sensitive data
    if (safeBody.password) safeBody.password = '[HIDDEN]';
    if (safeBody.token) safeBody.token = '[HIDDEN]';

    // After response is sent
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log('==============================');
      console.log(`[${req.method}] ${req.originalUrl}`);
      console.log('Status:', res.statusCode);
      console.log('Body:', safeBody);
      console.log(`Response Time: ${duration}ms`);
      console.log('==============================');
    });

    next();
  }
}
