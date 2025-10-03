import db from "../Configs/database.js";
import { NUMBER, ROLE_TYPE_ID } from "../Constant/constants.js";

class EmployeeModel{

    /**
     * Retrieves an employee record by email.
     *
     * @param {string} email - The email of the employee to retrieve.
     * @returns {Promise<Object>} response_data - Contains:
     *    - status: Boolean indicating success or failure.
     *    - result: Employee record if found.
     *    - error: Error message if not found or on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 20 2025 10:38 pm
     */
    static async getEmployeeEmail(email){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_all_employee_email] = await db.execute(`
                SELECT * 
                FROM employees
                WHERE email = ?
            `, [email]);

            if(get_all_employee_email.length){
                response_data.status = true;
                response_data.result = get_all_employee_email[0];
            }
            else{
                response_data.error = "email not found in model";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Creates a new employee record.
     *
     * @param {Object} userData - The user data to insert.
     * @param {string} userData.first_name - First name of the employee.
     * @param {string} userData.last_name - Last name of the employee.
     * @param {string} userData.email - Email address of the employee.
     * @param {number} userData.role - Role ID of the employee.
     * @param {number} userData.gender - Gender ID of the employee.
     * @param {string} userData.password - Hashed password.
     * @param {Object} [connection=db] - Optional database connection.
     * @returns {Promise<Object>} response_data - Contains:
     *    - status: Boolean indicating success or failure.
     *    - insert_employee_result: Object with inserted record ID if successful.
     *    - error: Error message if insert fails.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 21 2025 11:38 pm
     */
    static async createEmployeeAccount({ first_name, last_name, email, role, gender, password }, connection = db) {
        const response_data = { status: false, insert_employee_result: null, error: null };
    
        try{
            const [insert_employee_account] = await connection.execute(`
                INSERT INTO employees (
                    employee_role_type_id, 
                    employee_gender_id, 
                    first_name, 
                    last_name, 
                    email, 
                    password, 
                    created_at
                ) 
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `, [role, gender, first_name, last_name, email, password]);
    
            if(insert_employee_account.insertId){
                response_data.status = true;
                response_data.insert_employee_result = { id: insert_employee_account.insertId };
            } 
            else{
                response_data.error = "insert employee data error in model";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

     /**
     * Retrieves all employees where role type is intern or employee.
     *
     * @returns {Promise<Object>} response_data - Contains:
     *    - status: Boolean indicating success or failure.
     *    - result: Array of employee records if successful.
     *    - error: Error message if none found or on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 25, 2025 - 4:30 PM
     */
    static async getAllEmployeeAndIntern(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_all_employee_intern] = await db.execute(`
                SELECT 
                    id, 
                    first_name, 
                    last_name, 
                    email, 
                    employee_role_type_id
                FROM employees
                WHERE employee_role_type_id 
                IN (?, ?)
            `, [ROLE_TYPE_ID.intern, ROLE_TYPE_ID.employee]);

            if(get_all_employee_intern.length){
                response_data.status = true;
                response_data.result = get_all_employee_intern;
            }
            else{
                response_data.error = "no employee data found";
            }
        }
        catch(error){
            response_data.error =  error.message;
        }

        return response_data;
    }
    
    /**
     * Retrieves an employee record by ID.
     *
     * @param {number} employee_id - The ID of the employee to retrieve.
     * @returns {Promise<Object>} response_data - Contains:
     *    - status: Boolean indicating success or failure.
     *    - result: Employee record if found.
     *    - error: Error message if not found or on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 5:00 pm
     */
    static async getById(employee_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_employee_by_id_result] = await db.execute(`
                SELECT *
                FROM employees
                WHERE id = ? 
            `, [employee_id]);

            if(get_employee_by_id_result.length){
                response_data.status = true;
                response_data.result = get_employee_by_id_result[0];
            }
            else{
                response_data.error =  "employee id not found in employee model.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

}

export default EmployeeModel;
