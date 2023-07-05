import { 
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { Prisma } from '@prisma/client'
import { Response } from 'express'
import { ErrorMessageMapping, ErrorStatusCodes } from "./types";
import { replacePlaceHolder } from "src/helpers";


@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaFilter implements ExceptionFilter {

  private errorSatusCodesMap: ErrorStatusCodes = {
    'P2002': HttpStatus.CONFLICT,
  };

  private errorMessageMapping: ErrorMessageMapping = {
    'P2002': {error: 'unique constraint violated', message:'$field must be unique'},
  }

  private getErrorMessages(code: string, target: string) {
    const error  = this.errorMessageMapping[code];
    const message = replacePlaceHolder(error.message, {'field': target})
    return {[target]: message};
  }

  private getError(code: string) {
    const error  = this.errorMessageMapping[code] || null;
    if(error) return error.error || 'Unkdown error';
    return 'Unkdown error';
  }

  private getErrorCode(code: string) {
    return this.errorSatusCodesMap[code] || 500;
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const { code } = exception;
  
    if(exception instanceof Prisma.PrismaClientKnownRequestError) {
      response.status(this.getErrorCode(code)).json({
        message: this.getError(code),
        errors: this.getErrorMessages(code, exception.meta.target as string),
      });
    }
  } 
}
