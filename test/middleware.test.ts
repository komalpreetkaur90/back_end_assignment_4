import request from "supertest";
import app from "../src/app";

jest.mock("../src/config/firebaseConfig", () => ({
    db: {
    collection: jest.fn(() => ({
      get: jest.fn(() => ({
        docs: [
          { id: "1", data: () => ({ applicantName: "John Doe", amount: 25000, riskLevel: "High" }) },
          { id: "2", data: () => ({ applicantName: "Jane Smith", amount: 40000, riskLevel: "Medium" }) },
        ],
      })),
    })),
  },
  auth: {
    verifyIdToken: jest.fn(async (token: string) => {
      if (token === "admin-token") return { uid: "1", role: "admin" };
      if (token === "user-token") return { uid: "2", role: "user" };
      throw new Error("Invalid token");
    }),
  },
}));

describe("Middleware Integration Tests", () => {
    test("GET /api/v1/loans - admin access allowed", async () => {
        const res = await request(app)
            .get("/api/v1/loans")
            .set("Authorization", "Bearer admin-token");

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("loans");
    });

    test("GET /api/v1/loans - user access denied", async () => {
        const res = await request(app)
            .get("/api/v1/loans")
            .set("Authorization", "Bearer user-token");

        expect(res.status).toBe(403);
        expect(res.body.message).toContain("Insufficient role");
    });
});