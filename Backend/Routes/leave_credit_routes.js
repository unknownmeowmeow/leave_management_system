import express from "express";
import Credit from "../Controllers/credits.js"; 
import authSession from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/credits", authSession.requireLogin, (req, res) => Credit.allEmployeeCredit(req, res));
router.get("/history", authSession.requireLogin, (req, res) => Credit.employeeLeaveCreditHistory(req, res));
router.get("/all/history", authSession.requireLogin, (req, res) => Credit.employeeCreditLeave(req, res));
router.get("/:employee_id/summary", authSession.requireLogin, (req, res) => Credit.employeeLeaveCreditSummary(req, res));
router.post("/apply", authSession.requireLogin, (req, res) => Credit.addLeaveCredit(req, res));
router.get("/latest_credit", authSession.requireLogin, (req, res) => Credit.allLatestCredit(req, res));

export default router;
    