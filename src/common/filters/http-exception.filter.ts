import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong. Please try again.';
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const asRecord = res as Record<string, unknown>;

        if (Array.isArray(asRecord.message)) {
          errors = asRecord.message as string[];
          message = errors[0] ?? message;
        } else if (typeof asRecord.message === 'string') {
          message = asRecord.message;
        } else if (typeof asRecord.error === 'string') {
          message = asRecord.error;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      this.logger.error(exception.stack);
    } else {
      this.logger.error(String(exception));
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(errors ? { errors } : {}),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
