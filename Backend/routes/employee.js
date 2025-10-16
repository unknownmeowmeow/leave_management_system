import express from "express";
import employee from "../controllers/employees.js";

const router = express.Router();

router.post("/register", employee.employeeRegistration);
router.post("/login", employee.employeeLogin);
router.post("/logout", employee.employeeLogout);
router.get("/roles", employee.employeeRole);
router.get("/gender", employee.employeeGender);



export default router;
