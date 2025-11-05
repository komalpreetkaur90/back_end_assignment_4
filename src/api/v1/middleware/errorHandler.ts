import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { errorResponse } from "../models/responseModel";

/**
 * Global error handling middleware for an Express application.
 * Catches all errors passed to next() and formats them into a consistent response format.
 *
 * This middleware:
 * - Handles all AppError subclasses (AuthenticationError, AuthorizationError, etc.)
 * - Provides consistent error response format using errorResponse()
 * - Logs errors for debugging and monitoring
 * - Handles unexpected errors gracefully
 * - Prevents error details from leaking in production
 *
 * @param err - The error object passed from previous middleware or route handlers
 * @param req - Express request object
 * @param res - Express response object
 * @param _next - Express next function (unused but required for Express error middleware signature)
 */
const errorHandler = (
    err: Error | null,
    req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (!err) {
        const resp = errorResponse("An unexpected error occurred", "UNKNOWN_ERROR");
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            ...resp,
            message: "An unexpected error occurred", // Added for test compatibility
        });
        return;
    }

    // Log the error message for debugging
    console.error(`Error: ${err.message}`);

    // Log stack trace for non-production environments
    if (process.env.NODE_ENV !== "production") {
        console.error(`Stack: ${err.stack}`);
    }

    if (err instanceof AppError) {
        const resp = errorResponse(err.message, err.code);
        res.status(err.statusCode).json({
            ...resp,
            message: err.message, // Added for test compatibility
        });
    } else {
        const resp = errorResponse("An unexpected error occurred", "UNKNOWN_ERROR");
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            ...resp,
            message: "An unexpected error occurred", // Added for test compatibility
        });
    }
};

export default errorHandler;