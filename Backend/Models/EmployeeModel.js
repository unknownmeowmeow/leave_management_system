import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../Constant/Constants.js"

class EmployeeModel{
    
    /**
     * Get an employee record by email.
     * @param {string} email - The email of the employee to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status - Indicates success or failure of the query.
     * @property {Object|null} result - The retrieved employee record or null if not found.
     * @property {string|null} error - Error message if the query fails or data is not found.
     * created by: rogendher keith lachica
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

            if(get_all_email_result.length === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_FIND_EMAIL_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_email_result[0]; 
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Create a new user record.
     * @param {Object} userData - The user data to insert.
     * @param {string} userData.first_name - The first name of the user.
     * @param {string} userData.last_name - The last name of the user.
     * @param {string} userData email - The email of the user.
     * @param {number} userData.role - The role ID of the user.
     * @param {number} userData.gender - The gender ID of the user.
     * @param {string} userData.password - The hashed password of the user.
     * @returns {Promise<Object>} An object containing the query status, inserted ID result, and error if any.
     * @property {boolean} status - Indicates success or failure of the insert operation.
     * @property {Object|null} insert_employee_result - The inserted record ID if successful.
     * @property {string|null} error - Error message if the insert fails.
     * created by: rogendher keith lachica
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
                )
                 VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [ role, gender, first_name, last_name, email, password ]
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
}

export default EmployeeModel;
