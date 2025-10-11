import {ThrottlerGuard,ThrottlerLimitDetail,} from '@nestjs/throttler';
import { Injectable, ExecutionContext, HttpException,HttpStatus, } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    // You can even access request info if needed
    const request = context.switchToHttp().getRequest();

    // Example of custom structured response
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message:
          'You have exceeded the allowed number of requests. Please try again later.',
        path: request.url,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
