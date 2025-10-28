import express, { Express } from "express";
import morgan from "morgan";
import { loggerMiddleware } from "./api/v1/middleware/logger";
import loanRoutes from "./api/v1/routes/loanRoutes";

// Initialize Express application
const app: Express = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use(morgan("dev"));

// Define a route
app.get("/", (req, res) => {
    res.send("High-Risk Loan Monitoring API is running");
});

app.use("/api/v1/loans", loanRoutes);

export default app;





