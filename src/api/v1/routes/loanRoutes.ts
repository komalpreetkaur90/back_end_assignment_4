import express from "express";
import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan
} from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const router = express.Router();

router.use(authenticate, authorize({ hasRole: ["admin"] }));


router.get("/", getAllLoans);
router.get("/:id", getLoanById);
router.post("/", createLoan);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);

export default router;
