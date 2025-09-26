import express from "express";
import EmployeeControllers from "../Controllers/EmployeeControllers.js";
import LeaveFile from "../Controllers/LeaveFileControllers.js"
import AuthMiddleware from "../Middleware/authMiddleware.js";
const router = express.Router();

/**
 * @route POST /register
 * @desc Register a new employee/user
 * @access Public
 */
router.post("/register", EmployeeControllers.userRegistration);

/**
 * @route POST /login
 * @desc Authenticate user and create session or token
 * @access Public
 */
router.post("/login", EmployeeControllers.userLogin);

/**
 * @route POST /logout
 * @desc Handle user logout
 * @access Private
 */
router.post("/logout", EmployeeControllers.logout);

/**
 * @route GET /roles
 * @desc Get all employee role types
 * @access Public
 */
router.get("/roles", EmployeeControllers.getRoles);

/**
 * @route GET /gender
 * @desc Get all employee gender types
 * @access Public
 */
router.get("/gender", EmployeeControllers.getGender);

/**
 * @route GET /employee/credits
 * @desc Get all employee leave credit records
 * @access Private
 *
 * This route returns all leave credit entries for employees.
 * Useful for admin dashboards or employee credit views.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with credit records or error
 */
router.get("/credits", AuthMiddleware.requireLogin, EmployeeControllers.getAllEmployeeCredits);


export default router;
