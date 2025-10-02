import express from "express";
import EmployeeControllers from "../Controllers/employees.js";

const router = express.Router();

router.post("/register", EmployeeControllers.employeeRegistration);
router.post("/login", EmployeeControllers.employeeLogin);
router.post("/logout", EmployeeControllers.employeeLogout);
router.get("/roles", EmployeeControllers.employeeRole);
router.get("/gender", EmployeeControllers.employeeGender);



export default router;
