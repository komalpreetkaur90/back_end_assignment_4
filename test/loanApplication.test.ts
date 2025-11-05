import request from "supertest";
import app from "../src/app";

jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(async (token: string) => {
      if (token === "test-token") {
        return { uid: "mock-uid", role: "admin" };
      }
      throw new Error("Invalid token");
    }),
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(async () => ({ exists: true, data: () => ({ id: "1", applicantName: "John Doe", amount: 25000, riskLevel: "High" }) })),
        set: jest.fn(async () => ({})),
        update: jest.fn(async () => ({})),
        delete: jest.fn(async () => ({})),
      })),
      get: jest.fn(async () => ({
        docs: [
          { id: "1", data: () => ({ id: "1", applicantName: "John Doe", amount: 25000, riskLevel: "High" }) },
        ],
      })),
    })),
  },
}));

describe("Loan Application API Endpoints", () => {
  const token = "test-token";

  it("GET /api/v1/loans - should return all loan applications", async () => {
    const res = await request(app).get("/api/v1/loans").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        data: expect.any(Array)
      })
    );
  });

  it("GET /api/v1/loans/:id - should return a specific loan application", async () => {
    const res = await request(app).get("/api/v1/loans/1").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        data: expect.any(Object)
      })
    );
  });

  it("POST /api/v1/loans - should create a new loan application", async () => {
    const res = await request(app)
      .post("/api/v1/loans")
      .set("Authorization", `Bearer ${token}`)
      .send({ applicantName: "Test User", amount: 1000 });
    
    expect(res.status).toBe(201);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        data: expect.objectContaining({ applicantName: "Test User", amount: 1000 })
      })
    );
  });

  it("PUT /api/v1/loans/:id - should update a loan application", async () => {
    const res = await request(app)
      .put("/api/v1/loans/1")
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 2000 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        data: expect.objectContaining({ amount: 2000 })
      })
    );
  });

  it("DELETE /api/v1/loans/:id - should delete a loan application", async () => {
    const res = await request(app)
      .delete("/api/v1/loans/1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.any(String)
      })
    );
  });
});