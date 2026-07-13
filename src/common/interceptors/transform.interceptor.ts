import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((payload) => {
        // If service already returned the standardised shape, pass it through.
        if (
          payload &&
          typeof payload === 'object' &&
          'success' in payload &&
          'data' in payload
        ) {
          return payload as ApiResponse<T>;
        }

        // If service returned a plain `{ message: '...' }` object (delete ops), keep the message.
        if (
          payload &&
          typeof payload === 'object' &&
          !Array.isArray(payload) &&
          'message' in payload &&
          Object.keys(payload).length === 1
        ) {
          return {
            success: true,
            data: null as unknown as T,
            message: (payload as { message: string }).message,
          };
        }

        return { success: true, data: payload as T };
      }),
    );
  }
}
