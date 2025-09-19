import express from "express";
import EmployeeControllers from "../Controllers/EmployeeControllers.js";

const router = express.Router();

/**
 * @route POST /register
 * @desc Register a new employee/user
 * @access Public
 *
 * This route handles user registration.
 * It expects user details (e.g., name, email, password) in the request body.
 * 
 * @param {Object} req - Express request object with user registration data.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response indicating success or failure of registration.
 */
router.post("/register", EmployeeControllers.userRegistration);

/**
 * @route POST /login
 * @desc Authenticate user and create session or token
 * @access Public
 *
 * This route handles user login.
 * It expects credentials (e.g., email and password) in the request body.
 * On success, it creates a session or returns a token.
 * 
 * @param {Object} req - Express request object with login credentials.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with login status and possibly token/session info.
 */
router.post("/login", EmployeeControllers.userLogin);

/**
 * @route POST /logout
 * @desc Handle user logout
 * @access Private (requires user to be logged in)
 * 
 * This route destroys the user session or invalidates the token,
 * effectively logging the user out.
 * 
 * @param {Object} req - Express request object with session or token info.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response confirming logout or indicating an error.
 */
router.post("/logout", EmployeeControllers.logout);

/**
 * @route GET/id
 * 
 * This route GET
 * 
 * @param {Object} req - get the role id
 * @param {Object} req - response object
 * @returns {Object} JSON - response confirming the correct query for roles 
 */
router.get("/roles", EmployeeControllers.getRoles);
/**
 * @route GET/id
 * @param {Object} req - get the gender id
 * @param {Object} req - response object
 * @returns {Object} JSON - response confirming the correct query for gender
 */
router.get("/gender", EmployeeControllers.getGender);

export default router;
