
import { 
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from "@nestjs/common";
import { Prisma } from '@prisma/client'
import { Response } from 'express'


@Catch(Prisma.PrismaClientKnownRequestError)
export class WsPrismaFilter implements ExceptionFilter {

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    host.switchToWs().getClient().emit('error', 'prisma error');
    console.log('prisma error on ws');
    if(exception instanceof Prisma.PrismaClientKnownRequestError) {
    }
  } 
}
