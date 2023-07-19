import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    console.log(exception.getError())
    console.log(host.switchToWs().getClient().emit('error', exception.getError()))
    // super.catch(exception, host);
  }
}
