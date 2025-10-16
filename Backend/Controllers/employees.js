import bcrypt from "bcrypt";
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

    /**
     * Fetches all employee role types from the database.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
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
    }

    /**
     * Fetches all employee gender types from the database.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Object} JSON response indicating success or failure.
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
    }

    /**
     * Registers a new employee in the system, including validation, role and gender verification,
     * password hashing, and initial leave credit assignment if applicable.
     * @param {Object} req - Express request object containing registration details in req.body.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of registration.
     * Last Updated At: October 2, 2025
     * @author Keith
     */
    async employeeRegistration(req, res){
        const connection = await this.db.getConnection();
    
        try{
            await connection.beginTransaction();
    
            /* Validate employee registration input fields */
            const validation_error = this.validationHelper.validateEmployeeRegistration(req.body);
            
            if (validation_error.length) {
                throw new Error(validation_error.join(", "));
            }
            
            const { first_name, last_name, email, password, role, gender } = req.body;
    
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
                throw new Error(gender_record.error);
            } 
    
            /* Hash employee password */
            const hash_password = await bcrypt.hash(password, NUMBER.twelve);
            
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
            }
    
            const employee_id = employee_new_account.result.id;
            let leave_credit_data = [];
    
            /* If the role is 'employee', initialize leave credits */
            if(parseInt(role, NUMBER.ten) === ROLE_TYPE_ID.employee){
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
     * Handles employee login by validating credentials, verifying email existence,
     * comparing passwords, and establishing a user session.
     * @param {Object} req - Express request object containing login credentials.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of login.
     * Last Updated At: October 2, 2025
     * @author Keith
     */
    async employeeLogin(req, res){

        try{
            const validation_error = this.validationHelper.validateEmployeeLogin(req.body);
    
            if(validation_error.length){
                throw new Error(validation_error.join(", "));
            }
    
            const { email, password } = req.body;
            const employee_record = await this.employeeModel.getEmployeeId({email});
    
            if(!employee_record.status){
                throw new Error(employee_record.error);
            }
    
            const user = employee_record.result;
            const password_match = await bcrypt.compare(password, user.password);
    
            if(!password_match){
                throw new Error("Password does not match");
            }
    
            req.session.user = { 
                employee_id: user.id, 
                first_name: user.first_name, 
                last_name: user.last_name,
                email: user.email, 
                role: user.employee_role_type_id, 
                gender_id: user.employee_gender_id  
            };

            return res.json({ status: true, result: "Login successful", user: req.session.user });
    
        } 
        catch(error){
            return res.json({ status: false, error: error.message });
        }
    }

    /**
     * Logs out the currently logged-in employee by destroying the session.
     * @param {Object} req - Express request object containing session data.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response indicating success or failure of logout.
     * Last Updated At: September 26, 2025 12:25 PM
     * @author Keith
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

export default new EmployeeControllers();
