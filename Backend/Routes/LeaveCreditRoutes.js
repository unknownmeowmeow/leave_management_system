import express from "express";
import CreditControllers from "../Controllers/Credit.js";
import AuthMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/credits/yearly", CreditControllers.runYearlyCreditInsertion);
router.get("/credits", AuthMiddleware.requireLogin, CreditControllers.getAllEmployeeCredits);
export default router;
