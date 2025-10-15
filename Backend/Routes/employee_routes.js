import express from "express";
import employee from "../Controllers/employees.js"; 
import authSession from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", (req, res) => employee.employeeRegistration(req, res));
router.post("/login", (req, res) => employee.employeeLogin(req, res));
router.post("/logout", (req, res) => employee.employeeLogout(req, res));
router.get("/roles", (req, res) => employee.employeeRole(req, res));
router.get("/gender", (req, res) => employee.employeeGender(req, res));
router.get("/employeesbyrole", (req, res) => employee.employeeWorker(req, res));
router.get("/employees", authSession.requireLogin, (req, res) => employee.employeeWorker(req, res));
export default router;
