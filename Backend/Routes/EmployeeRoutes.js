import express from "express";
import EmployeeControllers from "../Controllers/employees.js";

const router = express.Router();

router.post("/register", EmployeeControllers.userRegistration);
router.post("/login", EmployeeControllers.userLogin);
router.post("/logout", EmployeeControllers.logout);
router.get("/roles", EmployeeControllers.getRoles);
router.get("/gender", EmployeeControllers.getGender);



export default router;
