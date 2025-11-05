import { Router } from "express";
import { setUserRole } from "../controllers/adminController";

const router = Router();

router.post("/set-role", setUserRole);

export default router;
