import bcrypt from "bcrypt";
<<<<<<< HEAD
import EmployeeModel from "../Models/employee.js"; 
import EmployeeGenderModel from "../Models/employee_gender.js";
import EmployeeRoleTypeModel from "../Models/employee_role_type.js";
import ValidationHelper from '../Helpers/validation_helper.js';
import LeaveTypeModel from "../Models/leave_type.js";
import LeaveCreditModel from "../Models/leave_credit.js";
import database from "../Configs/database.js";
import { NUMBER, ROLE_TYPE_ID, DECIMAL_NUMBER } from "../Constant/constants.js";

class EmployeeControllers{
    constructor(){
        this.employeeModel = EmployeeModel;
        this.genderModel = EmployeeGenderModel;
        this.roleModel = EmployeeRoleTypeModel;
        this.validationHelper = ValidationHelper;
        this.leaveTypeModel = LeaveTypeModel;
        this.leaveCreditModel = LeaveCreditModel;
        this.db = database;
    }
=======
import employee from "../models/employee.js"; 
import employeeGender from "../models/employee_gender.js";
import employeeRoleType from "../models/employee_role_type.js";
import validationHelper from '../helpers/validation_helper.js';
import leaveType from "../models/leave_type.js";
import leaveCredit from "../models/leave_credit.js";
import database from "../config/database.js";
import { DECIMAL_NUMBER, NUMBER, ROLE_TYPE_ID } from "../constant/constants.js";



class Employee{
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

    /**
     * Fetches all employee role types from the database.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
<<<<<<< HEAD
     * Last Updated At: October 2, 2025
     * @author Keith
     */
    async employeeRole(req, res){
        try {
            const role_type = await this.roleModel.getRoleTypeId();
        
            if(!role_type.status){
                throw new Error(role_type.error)
            }

            return res.json({ status: true, result: role_type.result });
        } 
        catch(error){
            return res.json({ status: false, error: error.message});
        }
=======
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static async employeeRole(req, res){
        const role_record = await employeeRoleType.getAllRoles();
        return res.json({ success: true, data: role_record.result });
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    }

    /**
     * Fetches all employee gender types from the database.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
<<<<<<< HEAD
     * Last Updated At: October 2, 2025
     * @author Keith
     */
    async employeeGender(req, res){
       
        try{
            const gender_type = await this.genderModel.getGenderId();

            if(!gender_type.status){
                throw new Error(gender_type.error);
            }

            return res.json({ status: true, result: gender_type.result });
       } 
       catch(error){
            return res.json({ status: false, error: error.message});
       }
=======
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
     */
    static async employeeGender(req, res) {
        const gender_record = await employeeGender.getAllGenders();
        return res.json({ success: true, data: gender_record.result });
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    }
    
    /**
     * Registers a new employee in the system, including validation, role and gender verification,
     * password hashing, and initial leave credit assignment if applicable.
     * @param {Object} req - Express request object containing registration details in req.body.
     * @param {Object} res - Express response object used to send JSON responses.
<<<<<<< HEAD
     * @returns {Object} JSON response indicating success or failure of registration.
     * Last Updated At: October 2, 2025
     * @author Keith
=======
     * @returns {Object} JSON response indicating the success or failure of the registration process.
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async employeeRegistration(req, res){
        const connection = await this.db.getConnection();
    
        try{
            await connection.beginTransaction();
<<<<<<< HEAD
=======
            const validation_error = validationHelper.validateEmployeeRegistration(req.body);
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    
            /* Validate employee registration input fields */
            const validation_error = this.validationHelper.validateEmployeeRegistration(req.body);
            
            if (validation_error.length) {
                throw new Error(validation_error.join(", "));
            }
            
            const { first_name, last_name, email, password, role, gender } = req.body;
    
<<<<<<< HEAD
            /* Check if email already exists */
            const email_exist = await this.employeeModel.getEmployeeId({email});
            
            if(email_exist.status){ 
                throw new Error("Email already exist");
            }
    
            /* Validate role */
            const role_record = await this.roleModel.getRoleTypeId(role);

            if(!role_record.status){
                throw new Error(role_record.error);
            }
    
            /* Validate gender */
            const gender_record = await this.genderModel.getGenderId(gender);

            if(!gender_record.status){
=======
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
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
                throw new Error(gender_record.error);
            } 
    
            /* Hash employee password */
            const hash_password = await bcrypt.hash(password, NUMBER.twelve);
<<<<<<< HEAD
            
            /*Prepare data to insert in database*/
            const create_employee = {
                first_name,
                last_name,
                email,
                password: hash_password,
                employee_role_type_id: parseInt(role),
                employee_gender_id: parseInt(gender)
            };
            
            /* Create new employee account */
            const employee_new_account = await this.employeeModel.createEmployeeAccount(create_employee, connection);
            
            if(!employee_new_account.status){
                throw new Error(employee_new_account.error);
=======
    
            // Create a new employee account record in the database
            const employee_new_account_record = await employee.createEmployeeAccount({ first_name, last_name, email, role, gender, password: hash_password }, connection);
    
            // If creation failed, throw an error with details
            if(!employee_new_account_record.status || employee_new_account_record.error){
                throw new Error(employee_new_account_record.error);
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
            }
    
            const employee_id = employee_new_account.result.id;
            let leave_credit_data = [];
    
            /* If the role is 'employee', initialize leave credits */
            if(parseInt(role, NUMBER.ten) === ROLE_TYPE_ID.employee){
<<<<<<< HEAD
                /* Fetch all leave types */
                const get_all_leave_types = await this.leaveTypeModel.getAllLeaveTypes();

                if(get_all_leave_types.status){
                    /* Prepare leave credit data for batch insertion */
                    leave_credit_data = get_all_leave_types.result.map(leave_type => ([ 
                        employee_id,
                        null, 
                        null, 
                        leave_type.id,
                        leave_type.base_value,
                        DECIMAL_NUMBER.zero_point_zero_zero, 
                        DECIMAL_NUMBER.zero_point_zero_zero, 
                        leave_type.base_value,       
                        leave_type.base_value
                    ]));
                }
                /* Insert leave credits in batch using the same transaction connection */
                if(leave_credit_data.length){
                    const leave_insert_credit = await this.leaveCreditModel.insertLeaveCredit( leave_credit_data, connection);

                    if(!leave_insert_credit.status){
                        throw new Error(leave_insert_credit.error);
=======
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
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
                    }
                }
            }
            
            await connection.commit();
            return res.json({ status: true, result: "Registration successfully" });
        } 
        catch(error){
            await connection.rollback();
            return res.json({ status: false, error: error.message});
        } 
        finally{
            connection.release();
        }
    }
    

    /**
     * @param {Object} req - Express request object containing login credentials.
     * @param {Object} res - Express response object used to send JSON responses.
<<<<<<< HEAD
     * @returns {Object} JSON response indicating success or failure of login.
     * Last Updated At: October 2, 2025
     * @author Keith
=======
     * @returns {Object} JSON response indicating the success or failure of login.
     * created by: Rogendher Keith Lachica
     * updated at: October 2, 2025 03:30 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async employeeLogin(req, res){

        try{
<<<<<<< HEAD
            const validation_error = this.validationHelper.validateEmployeeLogin(req.body);
=======
            const validation_error = validationHelper.validateEmployeeLogin(req.body);
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    
            if(validation_error.length){
                throw new Error(validation_error.join(", "));
            }
    
            const { email, password } = req.body;
<<<<<<< HEAD
            const employee_record = await this.employeeModel.getEmployeeId({email});
=======
            const employee_record = await employee.getEmployeeEmail(email);
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    
            if(!employee_record.status){
                throw new Error(employee_record.error);
            }
    
            const user = employee_record.result;
            const password_match = await bcrypt.compare(password, user.password);
    
            if(!password_match){
                throw new Error("Password does not match");
            }
    
<<<<<<< HEAD
            req.session.user = { 
                employee_id: user.id, 
                first_name: user.first_name, 
                last_name: user.last_name,
                email: user.email, 
                role: user.employee_role_type_id, 
                gender_id: user.employee_gender_id  
            };

            return res.json({ status: true, result: "Login successful", user: req.session.user });
=======
            req.session.user = {
                employee_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.employee_role_type_id
            };

            return res.json({ success: true, message: "Login successful", user: req.session.user });
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    
        } 
        catch(error){
            return res.json({ status: false, error: error.message });
        }
    }

    /**
     * Logs out the currently logged-in employee by destroying the session.
     * @param {Object} req - Express request object containing session data.
<<<<<<< HEAD
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of logout.
     * Last Updated At: September 26, 2025 12:25 PM
     * @author Keith
=======
     * @param {Object} res - Express response object for sending JSON.
     * @returns {Object} JSON response indicating success or failure.
     * created by: Rogendher Keith Lachica
     * updated at: September 26, 2025 12:25 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async employeeLogout(req, res){

        try{
            if(!req.session.user){
              throw new Error(" No Session for Employee Found Failed to Logout")
            }

            req.session.destroy(error => {
                
                if(error){
                    throw new Error("Server Error");
                }
                else{
                    return res.json({ status: true, result: "Successfully Logout" });
                }
            });
        }
        catch(error){
            return res.json({ status: false, error: error.message });
        }

    }

    /**
     * Retrieves all employees including interns.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response containing all employees or error.
     * Last Updated At: September 26, 2025 12:25 PM
     * @author Keith
     */
    async employeeWorker(req, res){
      
        try{
            const get_all_employee_record = await this.employeeModel.getAllWorker();
            
            if(!get_all_employee_record){
                throw new Error(get_all_employee_record.error)
            }

            return res.json({ status: true, result: get_all_employee_record.result });
        } 
        catch(error){
            return res.json({ status: false, error: error.message });
        }
    }
}

<<<<<<< HEAD
export default new EmployeeControllers();
=======
export default Employee; 
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
