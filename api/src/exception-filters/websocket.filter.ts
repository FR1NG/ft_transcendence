import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if(exception instanceof WsException)
      host.switchToWs().getClient().emit('error', exception.getError());
    else {
      const response = host.switchToHttp().getResponse();
      response.status(exception.response.statusCode).json(exception.response);
    }
  }
}
