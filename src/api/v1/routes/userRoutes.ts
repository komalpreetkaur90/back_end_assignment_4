import { Router } from "express";
import { getUser } from "../controllers/userController";

const router = Router();

router.get("/:uid", getUser);

export default router;
