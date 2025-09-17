import express from "express";
import EmployeeControllers from "../Controllers/EmployeeControllers.js";

const router = express.Router();

router.post("/register", EmployeeControllers.userRegistration);
router.post("/login", EmployeeControllers.userLogin);
router.post("/logout", EmployeeControllers.logout);

export default router;
