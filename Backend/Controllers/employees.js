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
     * Controller to get all roles and send as JSON response.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Promise<void>} Sends JSON response with roles or error message.
     * created by: rogendher keith lachica
     * updated at: September 19 2025 9:37 am  
     */
    static async getRoles(req, res){

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
    * Controller to get all genders and send as JSON response.
    * @param {Object} req - The Express request object.
    * @param {Object} res - The Express response object.
    * @returns {Promise<void>} Sends JSON response with genders or error message.
    * created by: rogendher keith lachica
    * updated at: September 19 2025 9:17 am  
    */
    static async getGender(req, res){

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
     * Controller to handle user registration.
     * Validates input data, checks for existing email,
     * verifies role and gender IDs, hashes password,
     * and creates a new user.
     * 
     * @param {Object} req - The Express request object.
     * @param {Object} req.body - The request body containing user details.
     * @param {string} req.body.first_name - User's first name.
     * @param {string} req.body.last_name - User's last name.
     * @param {string} req.body.email - User's email address.
     * @param {string} req.body.password - User's password.
     * @param {string} req.body.confirm_password - Confirmation of the user's password.
     * @param {number} req.body.role - Role ID of the user.
     * @param {number} req.body.gender - Gender ID of the user.
     * @param {Object} res - The Express response object.
     * @returns {Promise<Object>} Sends JSON response indicating success or failure.
     * created by: rogendher keith lachica
     * updated at: September 24 2025 1:59 pm    
     */
    static async userRegistration(req, res){
        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
            const validation_error = ValidationHelper.validateEmployeeRegistration(req.body);
            
            if(validation_error.length){
                await connection.rollback();
                return res.json({ success: false, errors: validation_error });
            }
    
            const { first_name, last_name, email, password, role, gender } = req.body;
            const email_exist = await EmployeeModel.getEmployeeEmail(email);
            
            if(email_exist.result){
                await connection.rollback();
                return res.json({ success: false, message: "Email Already Exists in Registration" });
            }
    
            const role_data = await EmployeeRoleTypeModel.getRoleTypeById(role);
    
            if(!role_data.result){
                await connection.rollback();
                return res.json({ success: false, message: "Failed to fetch roles" });
            }
    
            const gender_data = await EmployeeGenderModel.getGenderById(gender);
            
            if(!gender_data.result){
                await connection.rollback();
                return res.json({ success: false, message: "Failed to fetch gender in registration" });
            }
    
            const hash_password = await bcrypt.hash(password, NUMBER.twelve);
            const new_user = await EmployeeModel.createUser({ first_name, last_name, email, role, gender, password: hash_password }, connection);
    
            if(!new_user.status){
                await connection.rollback();
                return res.json({ success: false, message: "Registration Failed in controller" });
            }
    
            const employee_id = new_user.insert_employee_result.id;
    
            if(parseInt(role, NUMBER.ten) === ROLE_TYPE_ID.employee){
                const carry_over_leave_types = await LeaveTypeModel.getAllCarryOverLeaveTypes();
    
                if(carry_over_leave_types.result.length){

                    const employee_data = carry_over_leave_types.result.map(leave_type => [
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
                        await connection.rollback();
                        return res.json({ success: false, message: "Failed to insert leave credits" });
                    }
                }
            }
    
            await connection.commit();
            return res.json({ success: true, message: "Registration Successful in controller" });
        } 
        catch(error){
            await connection.rollback();
            return res.json({ success: false, message: "Server error register in controller" });
        } 
        finally{
            connection.release();
        }
    }
    
    /**
     * Controller to handle user login.
     * Validates input, checks for existing email,
     * compares password hash, and sets session data on success.
     * 
     * @param {Object} req - The Express request object.
     * @param {Object} req.body - The request body containing login details.
     * @param {string} req.body.email - The user's email.
     * @param {string} req.body.password - The user's password.
     * @param {Object} res - The Express response object.
     * @returns {Promise<Object>} Sends JSON response indicating success or failure.
     * created by: rogendher keith lachica
     * updated at: September 19 2025 10:47 am  
     */
    static async userLogin(req, res){

        try{
            const validation_error = ValidationHelper.validateEmployeeLogin(req.body);

            if(validation_error.length){
                return res.json({ success: false, errors: validation_error });
            }

            const { email, password } = req.body;
            const user_data = await EmployeeModel.getEmployeeEmail(email);

            if(!user_data.result){
                return res.json({ success: false, message: "Email not Found" });
            }

            const user = user_data.result;
            const match = await bcrypt.compare(password, user.password);

            if(!match){
                return res.json({ success: false, message: "Password do not Match" });
            }

            req.session.user = {
                employee_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.employee_role_type_id,
            };

            return res.json({ success: true, message: "Success login", user: req.session.user });
        }
        catch(error){
            return res.json({ success: false, message: "server error in controller login" });
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
    static async logout(req, res){

        try{

            if(!req.session.user){
                return res.json({ success: false, message: "No Employee Session Found in Log out."});
            }

            req.session.destroy(error => {
                if(error){
                    return res.json({ success: false, message: "Server error during Logout." });
                }
                else{
                    return res.json({ success: false, message: "Logout Failed."});
                }
            });
        }
        catch(error){
            return res.json({ success: false, message: "Server error during Logout." });
        }

    }
}

export default EmployeeControllers; 
