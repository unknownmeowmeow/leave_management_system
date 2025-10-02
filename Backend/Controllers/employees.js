import bcrypt from "bcrypt";
import EmployeeModel from "../Models/employee.js";
import EmployeeGenderModel from "../Models/employee_gender.js";
import EmployeeRoleTypeModel from "../Models/employee_role_type.js";
import ValidationHelper from '../Helpers/validation_helper.js';
import LeaveTypeModel from "../Models/leave_type.js";
import LeaveCreditModel from "../Models/leave_credit.js";
import database from "../Configs/database.js";
import { NUMBER, ROLE_TYPE_ID } from "../Constant/constants.js";



class EmployeeControllers{

    /**
     * Fetches all employee role types from the database.
     *
     * Workflow:
     * 1. **Fetch Roles from DB**
     *    - Calls `EmployeeRoleTypeModel.getAllRoles()` to retrieve all defined roles.
     *    - If an error occurs within the model, responds with `success: false` and the error message.
     *
     * 2. **Return Role Data**
     *    - If successful, returns the list of roles with a `success: true` flag.
     *
     * 3. **Error Handling**
     *    - If an unexpected error occurs (e.g., during the async call), it is caught and a generic failure response is returned.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   roles: [
     *     { id: 1, name: "Admin" },
     *     { id: 2, name: "Employee" },
     *     ...
     *   ]
     * }
     *
     * Example Response (Failure - Model Error):
     * {
     *   success: false,
     *   message: "Failed to connect to role table"
     * }
     *
     * Example Response (Failure - Uncaught Exception):
     * {
     *   success: false,
     *   message: "Failed to fetch roles"
     * }
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static async employeeRole(req, res){

        try{
            const role_data = await EmployeeRoleTypeModel.getAllRoles();

            if(role_data.error){
                return res.json({ success: false, message: role_data.error });
            }

            res.json({ success: true, roles: role_data.result });
        }
        catch{
            res.json({ success: false, message: "Failed to fetch roles"});
        }
    }

    /**
     * Fetches all employee gender types from the database.
     *
     * Workflow:
     * 1. **Fetch Genders from DB**
     *    - Calls `EmployeeGenderModel.getAllGenders()` to retrieve all defined gender options.
     *    - If an error occurs within the model, responds with `success: false` and the error message.
     *
     * 2. **Return Gender Data**
     *    - If successful, returns the list of genders with a `success: true` flag.
     *
     * 3. **Error Handling**
     *    - If an unexpected error occurs (e.g., during the async call), it is caught and a generic failure response is returned.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   genders: [
     *     { id: 1, name: "Male" },
     *     { id: 2, name: "Female" },
     *     ...
     *   ]
     * }
     *
     * Example Response (Failure - Model Error):
     * {
     *   success: false,
     *   message: "Database error while fetching genders"
     * }
     *
     * Example Response (Failure - Uncaught Exception):
     * {
     *   success: false,
     *   message: "Failed to fetch in gender registration"
     * }
     *
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static async employeeGender(req, res){

        try{
            const gender_data = await EmployeeGenderModel.getAllGenders();

            if(gender_data.error){
                return res.json({ success: false, message: gender_data.error });
            }

            res.json({ success: true, genders: gender_data.result });
        }
        catch{
            res.json({ success: false, message: "Failed to fetch in gender registration" });
        }
    }

   /**
     * Registers a new employee in the system, including validation, role and gender verification,
     * password hashing, and initial leave credit assignment if applicable.
     *
     * Workflow:
     * 1. **Open Database Transaction**
     *    - Establishes a connection and begins a transaction to ensure atomicity.
     *
     * 2. **Validate Request Data**
     *    - Uses `ValidationHelper.validateEmployeeRegistration()` to check input fields.
     *    - If validation errors exist, returns them immediately without proceeding.
     *
     * 3. **Check for Existing Email**
     *    - Calls `EmployeeModel.getEmployeeEmail(email)` to ensure email uniqueness.
     *    - Throws error if the email is already registered.
     *
     * 4. **Verify Role and Gender IDs**
     *    - Retrieves role and gender details from their respective models.
     *    - Throws error if invalid role or gender IDs are provided.
     *
     * 5. **Hash Password**
     *    - Secures password with bcrypt hashing using a defined salt rounds constant.
     *
     * 6. **Create Employee Record**
     *    - Calls `EmployeeModel.createEmployeeAccount()` with validated data and hashed password.
     *    - Throws error if registration fails.
     *
     * 7. **Assign Initial Leave Credits (Conditional)**
     *    - If the registered role is a regular employee:
     *      - Fetches all carry-over leave types.
     *      - Maps leave types to a structured array for bulk insertion of leave credits.
     *      - Inserts leave credits into the database.
     *      - Throws error if insertion fails.
     *
     * 8. **Commit or Rollback Transaction**
     *    - Commits transaction upon success.
     *    - Rolls back and returns error if any step fails.
     *
     * 9. **Release Database Connection**
     *    - Ensures connection release in the `finally` block to prevent leaks.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   message: "Registration Successful in controller"
     * }
     *
     * Example Response (Failure - Validation Error):
     * {
     *   success: false,
     *   errors: [ "First name is required", "Invalid email format" ]
     * }
     *
     * Example Response (Failure - Email Exists):
     * {
     *   success: false,
     *   message: "Email Already Exists in Registration in controller"
     * }
     *
     * Example Response (Failure - DB or Other Errors):
     * {
     *   success: false,
     *   message: "Registration Failed in controller"
     * }
     *
     * @param {Object} req - Express request object containing registration details in req.body.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating the success or failure of the registration process.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static async employeeRegistration(req, res){
        const connection = await database.getConnection();

        try{
            await connection.beginTransaction();

            const validation_error = ValidationHelper.validateEmployeeRegistration(req.body);

            if(validation_error.length){
                return res.json({ success: false, errors: validation_error });
            }

            const { first_name, last_name, email, password, role, gender } = req.body;
            const email_exist = await EmployeeModel.getEmployeeEmail(email);

            if(email_exist.result){
                throw new Error("Email Already Exists in Registration in controller");
            }

            const role_data = await EmployeeRoleTypeModel.getRoleTypeById(role);

            if(!role_data.result){
                throw new Error("Failed to fetch roles in controller");
            }

            const gender_data = await EmployeeGenderModel.getGenderById(gender);

            if(!gender_data.result){
                throw new Error("Failed to fetch gender in controller");
            }

            const hash_password = await bcrypt.hash(password, NUMBER.twelve);
            const employee_new_account_record = await EmployeeModel.createEmployeeAccount({ first_name, last_name, email, role, gender, password: hash_password }, connection);

            if(!employee_new_account_record.status){
                throw new Error("Registration Failed in controller");
            }

            const employee_id = employee_new_account_record.insert_employee_result.id;

            if(parseInt(role, NUMBER.ten) === ROLE_TYPE_ID.employee){
                const carry_over_leave_type_record = await LeaveTypeModel.getAllCarryOverLeaveTypes();
            
                if(carry_over_leave_type_record.status && carry_over_leave_type_record.result.length) {
                    const employee_data = carry_over_leave_type_record.result.map(leave_type => [
                        employee_id,
                        null,
                        null,
                        leave_type.id,
                        NUMBER.zero_point_zero_zero,
                        NUMBER.zero_point_zero_zero,
                        NUMBER.zero_point_zero_zero,
                        leave_type.base_value,
                        NUMBER.zero_point_zero_zero,
                        NUMBER.zero_point_zero_zero,
                        leave_type.base_value,
                        leave_type.base_value,
                        new Date()
                    ]);

                    const leave_credit = await LeaveCreditModel.insertLeaveCredit({ employee_data, connection });
            
                    if(!leave_credit.status){
                        throw new Error("Initial Leave credit failed to insert in controller");
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
     * Handles employee login by validating credentials, verifying email existence,
     * comparing passwords, and establishing a user session.
     *
     * Workflow:
     * 1. **Validate Login Data**
     *    - Uses `ValidationHelper.validateEmployeeLogin()` to check the request body.
     *    - Returns validation errors immediately if any.
     *
     * 2. **Check Email Existence**
     *    - Calls `EmployeeModel.getEmployeeEmail(email)` to fetch employee data by email.
     *    - Throws error if the email is not found or query fails.
     *
     * 3. **Verify Password**
     *    - Compares provided password with the stored hashed password using bcrypt.
     *    - Throws error if passwords do not match.
     *
     * 4. **Create Session**
     *    - Stores employee details in `req.session.user` to maintain login state.
     *
     * 5. **Respond with Success**
     *    - Returns JSON indicating successful login and session user data.
     *
     * 6. **Error Handling**
     *    - Catches any thrown errors and returns a failure JSON response with appropriate message.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   message: "Login successful",
     *   user: {
     *     employee_id: 123,
     *     first_name: "John",
     *     last_name: "Doe",
     *     email: "john.doe@example.com",
     *     role: 2
     *   }
     * }
     *
     * Example Response (Failure - Validation Error):
     * {
     *   success: false,
     *   errors: [ "Email is required", "Password must be at least 8 characters" ]
     * }
     *
     * Example Response (Failure - Email Not Found):
     * {
     *   success: false,
     *   message: "Email not found"
     * }
     *
     * Example Response (Failure - Password Mismatch):
     * {
     *   success: false,
     *   message: "Password does not match"
     * }
     *
     * @param {Object} req - Express request object containing login credentials.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating the success or failure of login.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */

    static async employeeLogin(req, res){

        try{
            const validation_error = ValidationHelper.validateEmployeeLogin(req.body);
    
            if(validation_error.length){
                return res.json({ success: false, errors: validation_error });
            }
    
            const { email, password } = req.body;
            const employee_record = await EmployeeModel.getEmployeeEmail(email);
    
            if(!employee_record.status || !employee_record.result){
                throw new Error("Email not found");
            }
    
            const user = employee_record.result;
            const match = await bcrypt.compare(password, user.password);
    
            if(!match){
                throw new Error("Password does not match");
            }
    
            req.session.user = {
                employee_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.employee_role_type_id,
            };
    
            return res.json({ success: true, message: "Login successful", user: req.session.user });
    
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error in controller" });
        }
    }
    

    /**
     * Logs out the currently logged-in employee by destroying the session.
     *
     * Workflow:
     * 1. **Check Active Session**
     *    - If `req.session.user` does not exist, return:
     *      `{ success: false, message: "No Employee Session Found in Log out." }`.
     *
     * 2. **Destroy Session**
     *    - Calls `req.session.destroy()` to clear the session.
     *    - If an error occurs during destruction → return:
     *      `{ success: false, message: "Server error during Logout." }`.
     *
     * 3. **Return Success**
     *    - If successful → return:
     *      `{ success: true, message: "Logout successful." }`.
     *
     * 4. **Error Handling**
     *    - Any unexpected errors caught by `try/catch` will return:
     *      `{ success: false, message: "Server error during Logout." }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   message: "Logout successful."
     * }
     *
     * Example Response (Failure - no session):
     * {
     *   success: false,
     *   message: "No Employee Session Found in Log out."
     * }
     *
     * Example Response (Failure - destroy error):
     * {
     *   success: false,
     *   message: "Server error during Logout."
     * }
     *
     * @param {Object} req - Express request object containing session data.
     * @param {Object} res - Express response object for sending JSON.
     * @returns {Object} JSON response indicating success or failure.
     *
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

export default EmployeeControllers; 
