import { Request, Response, NextFunction } from 'express'

import ApiError from '../helpers/apiError'

export default function (
    error: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Default to 500 if statusCode is not defined
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: message,
    })
}
