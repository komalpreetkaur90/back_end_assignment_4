import { 
    AppError, RepositoryError, ServiceError, AuthenticationError, AuthorizationError 
} from "../src/api/v1/errors/errors";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import { Request, Response, NextFunction } from "express";
import errorHandler from "../src/api/v1/middleware/errorHandler";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Custom Error Classes", () => {
    it("should create an AppError with correct properties", () => {
        const err = new AppError("App error", "APP_ERROR", 500);
        expect(err.message).toBe("App error");
        expect(err.code).toBe("APP_ERROR");
        expect(err.statusCode).toBe(500);
        expect(err instanceof Error).toBe(true);
    });

    it("should create a RepositoryError with default status 500", () => {
        const err = new RepositoryError("Repo error", "REPO_ERROR");
        expect(err.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    it("should create a ServiceError with default code and status", () => {
        const err = new ServiceError("Service error");
        expect(err.code).toBe("SERVICE_ERROR");
        expect(err.statusCode).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    });

    it("should create an AuthenticationError with default code and 401 status", () => {
        const err = new AuthenticationError("Auth error");
        expect(err.code).toBe("AUTHENTICATION_ERROR");
        expect(err.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    it("should create an AuthorizationError with default code and 403 status", () => {
        const err = new AuthorizationError("Forbidden");
        expect(err.code).toBe("AUTHORIZATION_ERROR");
        expect(err.statusCode).toBe(HTTP_STATUS.FORBIDDEN);
    });
});

describe("errorHandler middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnValue({ json: jsonMock }),
            json: jsonMock,
        };
    });

    it("should format AppError correctly", () => {
        const appError = new AppError("Test error", "TEST_ERROR", 400);
        errorHandler(appError, mockReq as Request, mockRes as Response, {} as NextFunction);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: { message: "Test error", code: "TEST_ERROR" },
            })
        );
    });

    it("should handle unknown errors", () => {
        const unknownError = new Error("Unknown error");
        errorHandler(unknownError, mockReq as Request, mockRes as Response, {} as NextFunction);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: { message: "An unexpected error occurred", code: "UNKNOWN_ERROR" },
            })
        );
    });

    it("should handle null error", () => {
        errorHandler(null, mockReq as Request, mockRes as Response, {} as NextFunction);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
                success: false,
                error: { message: "An unexpected error occurred", code: "UNKNOWN_ERROR" },
            })
        );
    });

    it("should handle null error", () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        errorHandler(null, mockReq as Request, mockRes as Response, {} as NextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith(
            expect.objectContaining({
            success: false,
            error: { message: "An unexpected error occurred", code: "UNKNOWN_ERROR" },
        })
    );

    consoleSpy.mockRestore();
    });
});