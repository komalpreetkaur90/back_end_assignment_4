import express, { Express } from "express";
import morgan from "morgan";
import loanRoutes from "./api/v1/routes/loanRoutes";
import userRoutes from "./api/v1/routes/userRoutes"; 
import adminRoutes from "./api/v1/routes/adminRoutes";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import authMiddleware from "./api/v1/middleware/authenticate";

// Initialize Express application
const app: Express = express();

// Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

app.use(express.json());
app.use(morgan("dev"));

app.use(authMiddleware);

// Define a route
app.get("/", (req, res) => {
    res.send("High-Risk Loan Monitoring API is running");
});

app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);

export default app;









