import bcrypt from "bcrypt";
import EmployeeModel from "../Models/Employee.js";
import EmployeeGenderModel from "../Models/EmployeeGender.js";
import EmployeeRoleTypeModel from "../Models/EmployeeRoleType.js";
import ValidationHelper from '../Helpers/ValidationHelper.js';
import LeaveTypeModel from "../Models/LeaveType.js";
import LeaveCreditModel from "../Models/LeaveCredit.js";
import database from "../Configs/Database.js";



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
            const response_data = await EmployeeRoleTypeModel.getAllRoles();

            if(response_data.error){
                return res.json({ success: false, message: response_data.error });
            }
            res.json({ success: true, roles: response_data.result });
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
            const response_data = await EmployeeGenderModel.getAllGenders();

            if(response_data.error){
                return res.json({ success: false, message: response_data.error });
            }
            res.json({ success: true, genders: response_data.result });
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
    static async userRegistration(req, res) {
        const connection = await database.getConnection();
    
        try {
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
            const role_data = await EmployeeRoleTypeModel.getRoleById(role);

            if(!role_data.result){
                await connection.rollback();
                return res.json({ success: false, message: "Failed to fetch roles" });
            }
            const gender_data = await EmployeeGenderModel.getGenderById(gender);
            
            if(!gender_data.result){
                await connection.rollback();
                return res.json({ success: false, message: "Failed to fetch in gender registration" });
            }
            const hash_password = await bcrypt.hash(password, 12);
            const new_user = await EmployeeModel.createUser({ first_name, last_name, email, role, gender, password: hash_password }, connection);
    
            if(new_user.status){
                const employee_id = new_user.insert_employee_result.id;
    
                if(parseInt(role, 10) === 3){
                    const carry_over_leave_types = await LeaveTypeModel.getAllCarryOverLeaveTypes();
    
                    const insert_employee_data = carry_over_leave_types.result.map(leave_type => ({
                        employee_id,
                        leave_transaction_id: null,
                        attendance_id: null,
                        leave_type_id: leave_type.id,
                        earned_credit: leave_type.base_value,
                        used_credit: 0.00,
                        deducted_credit: 0.00,
                        current_credit: leave_type.base_value,
                        latest_credit: leave_type.base_value, 
                        connection
                    }));
                    console.log("insert credit", insert_employee_data);
    
                    await Promise.all( insert_employee_data.map(insert_base_value => LeaveCreditModel.insertLeaveCredit(insert_base_value)));
                }
                await connection.commit();
                return res.json({ success: true, message: "Registration Successful in controller" });
            } 
            else{
                await connection.rollback();
                return res.json({ success: false, message: "Registration Failed in controller" });
            }
        } 
        catch(error){
            await connection.rollback();
            return res.json({ success: false, message: "server error in controller" });
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

            return res.json({
                success: true,
                message: "Success login",
                user: req.session.user,
            });
        }
        catch(error){
            return res.json({ success: false, message: "server error in controller login" });
        }
    }

    /**
     * Controller to handle user logout.
     * Destroys the user session if active.
     * 
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     * @returns {Promise<Object>} Sends JSON response indicating success or failure.
     * created by: rogendher keith lachica
     * updated at: September 19 2025 11:45 pm  
     */
    static async logout(req, res){

        try{

            if(!req.session.user){
                return res.json({ success: false, message: "No Employee Session Found in Log out."});
            }

            req.session.destroy(error =>{
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
