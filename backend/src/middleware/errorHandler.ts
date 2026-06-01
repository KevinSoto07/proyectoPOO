import { Request, Response, NextFunction } from 'express';
import { stat } from 'node:fs';

export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) : void => {
    console.error(`${err.name}: ${err.message}`);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: true,
            message: err.message,
        });
        return;
    }

    res.status(500).json({
        error: true,
        message: 'Error interno del servidor',
    })
}