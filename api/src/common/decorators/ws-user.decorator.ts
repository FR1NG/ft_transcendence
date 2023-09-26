import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const WsUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToWs().getClient();
    const { user } = request;
    return user;
  }
)
