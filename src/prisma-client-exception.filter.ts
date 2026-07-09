import { ArgumentsHost, Catch, ConflictException, HttpStatus, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch (exception.code) {
            case 'P2002': {
                const status = HttpStatus.CONFLICT;
                const message = 'Unique constraint failed on the database fields';
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    error: 'Conflict',
                });
                break;
            }
            case 'P2025': {
                const status = HttpStatus.NOT_FOUND;
                const message = exception.meta?.cause || 'Record to update or delete not found';
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    error: 'Not Found',
                });
                break;
            }
            default:
                // Let the base exception filter handle everything else
                super.catch(exception, host);
                break;
        }
    }
}
