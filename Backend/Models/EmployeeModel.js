import db from "../Configs/Database.js";
import {
    STATUS_QUERY, ZERO, TWO, THREE, ERROR_IN_GET_ID
} from "../Constant/Constants.js"

class EmployeeModel {

    /**
     * Retrieves an employee record by email.
     *
     * - Queries the `employees` table for the given email.
     * - Returns employee details if found, or an error if not.
     *
     * @param {string} email The email of the employee to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status Indicates success or failure of the query.
     * @property {Object|null} result The retrieved employee record or null if not found.
     * @property {string|null} error Error message if the query fails or data is not found.
     * created by: Rogendher Keith Lachica
     * updated at: September 20 2025 10:38 pm  
     */
    static async getEmployeeEmail(email){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_email_result] = await db.execute(`
                SELECT * 
                FROM employees
                WHERE email = ?
            `, [email]);

            if(get_all_email_result.length === ZERO){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_FIND_EMAIL_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_email_result[ZERO];
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
     * - Inserts employee data into the `employees` table.
     * - Accepts role, gender, name, email, and hashed password.
     * - Automatically sets creation and update timestamps.
     *
     * @param {Object} userData The user data to insert.
     * @param {string} userData.first_name The first name of the user.
     * @param {string} userData.last_name The last name of the user.
     * @param {string} userData.email The email of the user.
     * @param {number} userData.role The role ID of the user.
     * @param {number} userData.gender The gender ID of the user.
     * @param {string} userData.password The hashed password of the user.
     * @returns {Promise<Object>} An object containing the query status, inserted ID result, and error if any.
     * @property {boolean} status Indicates success or failure of the insert operation.
     * @property {Object|null} insert_employee_result The inserted record ID if successful.
     * @property {string|null} error Error message if the insert fails.
     * created by: Rogendher Keith Lachica
     * updated at: September 21 2025 11:38 pm  
     */
    static async createUser({ first_name, last_name, email, role, gender, password }){
        const response_data = { ...STATUS_QUERY };

        try{
            const [insert_employee_data_result] = await db.execute(`
                INSERT INTO employees (
                    employee_role_type_id, 
                    employee_gender_id, 
                    first_name, 
                    last_name, 
                    email, 
                    password, 
                    created_at, 
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [role, gender, first_name, last_name, email, password]
            );

            if(!insert_employee_data_result.insertId){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_CREATE_EMPLOYEE_MODEL;
            }
            else{
                response_data.status = true;
                response_data.insert_employee_result = { id: insert_employee_data_result.insertId };
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }
    /**
     * Retrieves all employees where role type is 2 or 3 (e.g., Full-Time or Part-Time).
     *
     * - Returns list of employees with employee_role_type_id IN (2,3)
     * - Returns an array of employees if found, or empty if none.
     *
     * @returns {Promise<Object>} An object with query status, result, and error if any.
     * @property {boolean} status - Query success status.
     * @property {Array|null} result - Array of employee records.
     * @property {string|null} error - Error message if query fails.
     * created by: Rogendher Keith Lachica  
     * updated at: September 25, 2025 - 4:30 PM
     */
    static async getAllEmployeeByRoleId(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_employee_role_id_result] = await db.execute(`
                SELECT id, first_name, last_name, email, employee_role_type_id
                FROM employees
                WHERE employee_role_type_id IN (?, ?)
            `, [TWO, THREE]);

            if(get_all_employee_role_id_result.length === ZERO){
                response_data.status = true;
                response_data.result = [];
            }
            else{
                response_data.status = true;
                response_data.result = get_all_employee_role_id_result;
            }
        }
        catch(error){
            response_data.status = false;
            response_data.result = null;
            response_data.error = ERROR_IN_GET_EMPLOYEES_BY_ROLE_TYPE || error.message;
        }

        return response_data;
    }
    // ... existing methods ...

    /**
     * Retrieves an employee record by ID.
     *
     * - Queries the `employees` table for the given employee ID.
     * - Returns employee details if found, or an error if not.
     *
     * @param {number} employee_id The ID of the employee to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status Indicates success or failure of the query.
     * @property {Object|null} result The retrieved employee record or null if not found.
     * @property {string|null} error Error message if the query fails or data is not found.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 5:00 pm
     */
    static async getById(employee_id){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_employee_by_id_result] = await db.execute(`
                SELECT *
                FROM employees
                WHERE id = ?
            `, [employee_id]);

            if(get_employee_by_id_result.length === ZERO){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_GET_ID;
            }
            else{
                response_data.status = true;
                response_data.result = get_employee_by_id_result[ZERO];
            }
        }
        catch(error){
            response_data.status = false;
            response_data.result = null;
            response_data.error = error.message;
        }

        return response_data;
    }


}

export default EmployeeModel; 
