import bcrypt from "bcrypt";
import EmployeeModel from "../Models/EmployeeModel.js";
import EmployeeGenderModel from "../Models/EmployeeGenderModel.js";
import EmployeeRoleTypeModel from "../Models/EmployeeRoleTypeModel.js";
import ValidationHelper from '../Helpers/ValidationHelper.js';
import {
    MESSAGE_CONFIRM_PASSWORD, MESSAGE_EMAIL_EXIST, MESSAGE_REGISTRATION_MESSAGE, MESSAGE_FAILED_REGISTRATION_MESSAGE,
    MESSAGE_FAILED_CATCH_IN_REGISTRATION_MESSAGE, MESSAGE_EMAIL_NOT_FOUND, MESSAGE_NO_EMPLOYEE_SESSION,
    MESSAGE_IN_SUCCESS_LOGOUT, MESSAGE_FAILED_CATCH_IN_LOGIN_MESSAGE, MESSAGE_FAILED_CATCH_IN_LOGOUT_MESSAGE,
    CATCH_IN_GENDER, CATCH_IN_ROLE
} from "../constant.js";


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
            res.json(CATCH_IN_ROLE);
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
            res.json(CATCH_IN_GENDER);
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
     * updated at: September 19 2025 3:47 pm    
     */
    static async userRegistration(req, res){

        try{
            const validation_error = ValidationHelper.validateEmployeeRegistration(req.body);

            if(validation_error.length){
                return res.json({ success: false, errors: validation_error });
            }
            const { first_name, last_name, email, password, role, gender } = req.body;
            const email_exist = await EmployeeModel.getEmployeeEmail(email);
            
            if(email_exist.result){
                return res.json(MESSAGE_EMAIL_EXIST);
            }
            const role_data = await EmployeeRoleTypeModel.getRoleById(role);
            
            if(!role_data.result){
                return res.json(CATCH_IN_ROLE);
            }
            const gender_data = await EmployeeGenderModel.getGenderById(gender);
            
            if(!gender_data.result){
                return res.json(CATCH_IN_GENDER);
            }
            const hash_password = await bcrypt.hash(password, 12);

            const new_user = await EmployeeModel.createUser({
                first_name,
                last_name,
                email,
                role,
                gender,
                password: hash_password,
            });

            if(new_user.status){
                return res.json(MESSAGE_REGISTRATION_MESSAGE);
            } 
            else{
                return res.json(MESSAGE_FAILED_REGISTRATION_MESSAGE);
            }
        } 
        catch(error){
            return res.json(MESSAGE_FAILED_CATCH_IN_REGISTRATION_MESSAGE);
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
    static async userLogin(req, res) {
        try {
            const validation_error = ValidationHelper.validateEmployeeLogin(req.body);
    
            if(validation_error.length){
                return res.json({ success: false, errors: validation_error });
            }
            const { email, password } = req.body;
            const user_data = await EmployeeModel.getEmployeeEmail(email);
    
            if(!user_data.result){
                return res.json(MESSAGE_EMAIL_NOT_FOUND);
            }
            const user = user_data.result;
            const match = await bcrypt.compare(password, user.password);
    
            if(!match){
                return res.json(MESSAGE_CONFIRM_PASSWORD);
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
            return res.json(MESSAGE_FAILED_CATCH_IN_LOGIN_MESSAGE);
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
                return res.json(MESSAGE_NO_EMPLOYEE_SESSION);
            }

            req.session.destroy(error =>{
                if(error){
                    return res.json(MESSAGE_FAILED_CATCH_IN_LOGOUT_MESSAGE);
                }
                else{
                    return res.json(MESSAGE_IN_SUCCESS_LOGOUT);
                }
            });
        }
        catch(error){
            return res.json(MESSAGE_FAILED_CATCH_IN_LOGOUT_MESSAGE);
        }
    }

}

export default EmployeeControllers;
