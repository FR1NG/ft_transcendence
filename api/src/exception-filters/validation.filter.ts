import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch(HttpException)
export class ValidationExceptionFilterFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

      const exceptionResponse = exception.getResponse() as Record<string, any>;
      const { message, statusCode } = exceptionResponse;
    if (exception instanceof BadRequestException) {
      console.log(exception);
      const costumeMessages = {};

      if(message instanceof Array) {
        message.forEach(e => {
         const key = e.split(' ')[0];
          costumeMessages[key] = e.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
        });
      }

      response.status(400).json({
        message: 'validation faild',
        errors: costumeMessages,
      });
    } else {
      response.status(exception.status).json({
        message,
      });
    }
  }
}
