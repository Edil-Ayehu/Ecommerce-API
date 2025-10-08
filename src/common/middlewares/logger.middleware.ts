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

    // Store the original res.send method
    const originalSend = res.send;

    // Temporary variable to capture the response body
    let responseBody: any;

    // Override res.send to capture the response
    res.send = function (body) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // After response is sent
    res.on('finish', () => {

      const duration = Date.now() - start;

      // Try parsing JSON response safely
      let parsedResponse;
      try {
        parsedResponse = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
      } catch {
        parsedResponse = responseBody;
      }

      console.log('==============================');
      console.log(`[${req.method}] ${req.originalUrl}`);
      console.log('Status:', res.statusCode);
      console.log('Body:', safeBody);
      console.log('Response:', parsedResponse);
      console.log(`Response Time: ${duration}ms`);
      console.log('==============================');
    });

    next(); // every middleware need to have this method at the end
  }
}
