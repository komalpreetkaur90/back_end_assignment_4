import authenticate from "../src/api/v1/middleware/authenticate";
import { Request, Response, NextFunction } from "express";
import { auth } from "../src/config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";

jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

describe("Authentication Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response> & { locals: Record<string, any> };
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = { locals: {} };
    next = jest.fn();
  });

  test("should attach uid and role for valid token", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "123", role: "officer" });
    req.headers = { authorization: "Bearer valid-token" };

    await authenticate(req as Request, res as Response, next);

    expect(res.locals.uid).toBe("123");
    expect(res.locals.role).toBe("officer");
    expect(next).toHaveBeenCalledWith();
  });

  test("should throw AuthenticationError for missing token", async () => {
    await authenticate(req as Request, res as Response, next);
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toContain("No token provided");
  });

  test("should throw AuthenticationError for invalid token", async () => {
    (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("Invalid token"));
    req.headers = { authorization: "Bearer invalid-token" };

    await authenticate(req as Request, res as Response, next);
    const error = (next as jest.Mock).mock.calls[0][0];
    expect(error).toBeInstanceOf(AuthenticationError);
    expect(error.message).toContain("Unauthorized");
  });
});
