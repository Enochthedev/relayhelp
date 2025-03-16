import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { REQUEST_HEADERS, REQUEST_CONTEXT_KEYS } from './request.constants';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    request.requestContext = {
      [REQUEST_CONTEXT_KEYS.TENANT_ID]: request.headers[REQUEST_HEADERS.TENANT_ID] || null,
      [REQUEST_CONTEXT_KEYS.TEAM_ID]: request.headers[REQUEST_HEADERS.TEAM_ID] || null,
      [REQUEST_CONTEXT_KEYS.USER_ID]: request.user?.id || request.headers[REQUEST_HEADERS.USER_ID] || null,
      [REQUEST_CONTEXT_KEYS.REQUEST_ID]: request.headers[REQUEST_HEADERS.REQUEST_ID] || null,
    };

    return next.handle();
  }
}