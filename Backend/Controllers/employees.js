import bcrypt from "bcrypt";
import employee from "../models/employee.js"; 
import employeeGender from "../models/employee_gender.js";
import employeeRoleType from "../models/employee_role_type.js";
import validationHelper from '../helpers/validation_helper.js';
import leaveType from "../models/leave_type.js";
import leaveCredit from "../models/leave_credit.js";
import database from "../config/database.js";
import { DECIMAL_NUMBER, NUMBER, ROLE_TYPE_ID } from "../constant/constants.js";



class Employee{

    /**
     * Fetches all employee role types from the database.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static async employeeRole(req, res){
        const role_record = await employeeRoleType.getAllRoles();
        return res.json({ success: true, data: role_record.result });
    }

    /**
     * Fetches all employee gender types from the database.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static async employeeGender(req, res) {
        const gender_record = await employeeGender.getAllGenders();
        return res.json({ success: true, data: gender_record.result });
    }
    
    /**
     * Registers a new employee in the system, including validation, role and gender verification,
     * password hashing, and initial leave credit assignment if applicable.
     * @param {Object} req - Express request object containing registration details in req.body.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating the success or failure of the registration process.
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static async employeeRegistration(req, res){
        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
            const validation_error = validationHelper.validateEmployeeRegistration(req.body);
    
            // If there are validation errors
            if(validation_error.length){
                return res.json({ success: false, errors: validation_error });
            }
    
            // Destructure registration data from the request body
            const { first_name, last_name, email, password, role, gender } = req.body;
    
            // Check if the email already exists in the database
            const email_exist = await employee.getEmployeeEmail(email);
    
            // If email exists, throw an error to prevent duplicate registration
            if(email_exist.status){
                throw new Error("Email already exist");
            }
    
            // Get role data based on provided role ID
            const role_record = await employeeRoleType.getRoleTypeById(role);
    
            // If role data is invalid or contains an error, throw an error
            if(!role_record.status || role_record.error){
                throw new Error(role_record.error);
            }
    
            // Get gender data based on provided gender ID
            const gender_record = await employeeGender.getGenderById(gender);
    
            // If gender data is invalid or contains an error, throw an error
            if(!gender_record.status || gender_record.error){
                throw new Error(gender_record.error);
            }
    
            // Hash the password securely with bcrypt
            const hash_password = await bcrypt.hash(password, NUMBER.twelve);
    
            // Create a new employee account record in the database
            const employee_new_account_record = await employee.createEmployeeAccount({ first_name, last_name, email, role, gender, password: hash_password }, connection);
    
            // If creation failed, throw an error with details
            if(!employee_new_account_record.status || employee_new_account_record.error){
                throw new Error(employee_new_account_record.error);
            }
    
            // Get the newly created employee ID
            const employee_id = employee_new_account_record.insert_employee_result.id;
    
            // If the employee role is a regular employee, assign initial leave credits
            if(parseInt(role, NUMBER.ten) === ROLE_TYPE_ID.employee){
                // Fetch all leave types that carry over
                const carry_over_leave_type_record = await leaveType.getAllCarryOverLeaveTypes();
            
                // If leave types exist, prepare data for insertion
                if(carry_over_leave_type_record.status && carry_over_leave_type_record.result.length) {
                    // Map leave types into batch insert array
                    const employee_data = carry_over_leave_type_record.result.map(leave_type => [employee_id,null, null, leave_type.id,leave_type.base_value,DECIMAL_NUMBER.zero_point_zero_zero, DECIMAL_NUMBER.zero_point_zero_zero, leave_type.base_value, leave_type.base_value,new Date()]);
                    // Insert leave credits in batch
                    const leave_credit_record = await leaveCredit.insertLeaveCredit({ employee_data, connection });
            
                    // If insertion failed, throw an error
                    if(!leave_credit_record.status || leave_credit_record.error){
                        throw new Error(leave_credit_record.error);
                    }
                }
            }
            
            await connection.commit();
            return res.json({ success: true, message: "Registration Successful in controller" });
        } 
        catch(error){
            await connection.rollback();
            return res.json({ success: false, message: error.message || "Server error register in controller" });
        } 
        finally{
            connection.release();
        }
    }
    
    /**
     * @param {Object} req - Express request object containing login credentials.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating the success or failure of login.
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */

    static async employeeLogin(req, res){

        try{
            const validation_error = validationHelper.validateEmployeeLogin(req.body);
    
            if(validation_error.length){
                return res.json({ success: false, errors: validation_error });
            }
    
            const { email, password } = req.body;
            const employee_record = await employee.getEmployeeEmail(email);
    
            if(!employee_record.status || employee_record.error){
                throw new Error(employee_record.error);
            }
    
            const user = employee_record.result;
            const match = await bcrypt.compare(password, user.password);
    
            if(!match){
                throw new Error("Password does not match");
            }
    
            req.session.user = { employee_id: user.id, first_name: user.first_name, last_name: user.last_name,email: user.email, role: user.employee_role_type_id };
            return res.json({ success: true, message: "Login successful", user: req.session.user });
    
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error in controller" });
        }
    }
    

    /**
     * Logs out the currently logged-in employee by destroying the session.
     * @param {Object} req - Express request object containing session data.
     * @param {Object} res - Express response object for sending JSON.
     * @returns {Object} JSON response indicating success or failure.
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 12:25 PM
     */
    static async employeeLogout(req, res){

        try{
            if(!req.session.user){
              throw new Error(" No Session for Employee Found Failed to Logout")
            }

            req.session.destroy(error => {
                if(error){
                    throw new Error("Server Error");
                }
                else{
                    return res.json({ success: true, message: "Successfully Logout" });
                }
            });
        }
        catch(error){
            return res.json({ success: false, message: error.message || "Server error register in controller" });
        }

    }
}

export default Employee; 
