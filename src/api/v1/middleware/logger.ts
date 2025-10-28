import morgan from "morgan";
import fs from "fs";
import path from "path";
import { RequestHandler } from "express";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logStream = fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });
export const loggerMiddleware: RequestHandler = morgan("combined", { stream: logStream });
