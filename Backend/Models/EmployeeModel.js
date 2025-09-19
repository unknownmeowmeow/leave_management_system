import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../constant.js";

class EmployeeModel {
    
    /**
     * Get an employee record by email.
     * @param {string} email - The email of the employee to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status - Indicates success or failure of the query.
     * @property {Object|null} result - The retrieved employee record or null if not found.
     * @property {string|null} error - Error message if the query fails or data is not found.
     */
    static async getEmployeeEmail(email) {
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_email_result] = await db.execute(`
                SELECT * 
                FROM employees
                WHERE email = ?
            `, [email]);

            if(get_all_email_result.length){
                response_data.status = true;
                response_data.result = get_all_email_result[0];
            }
            else{
                response_data.result = null;
                response_data.error = "Email not found.";
            }
        }
        catch(error){
            response_data.error = error.message || error;
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
     */
    static async createUser({ first_name, last_name, email, role, gender, password }) {
        const response_data = { ...STATUS_QUERY };

        try{
            const [insert_employee_data_result] = await db.execute(`
                INSERT INTO employees(
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
            `, [role, gender, first_name, last_name, email, password]
            );

            if(insert_employee_data_result.insertId){
                response_data.status = true;
                response_data.insert_employee_result = { id: insert_employee_data_result.insertId };
            }
            else{
                response_data.error = "Insert failed.";
            }
        }
        catch(error){
            response_data.error = error.message || error;
        }
        return response_data;
    }
}

export default EmployeeModel;
