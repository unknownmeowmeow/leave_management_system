import db from "../Configs/Database.js";
import { STATUS_QUERY, ERROR_IN_GET_ROLE_BY_ID_MODEL,
    GET_ROLE_BY_EMPLOYEE
} from "../Constant/Constants.js"

class EmployeeRoleTypeModel {

    /**
     * Retrieves a role record by its ID.
     *
     * - Queries the `employee_role_types` table for the matching role.
     * - Returns the full role record if found.
     * - If not found, returns an error message.
     *
     * @param {number} role_id The ID of the role to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status Indicates success or failure of the query.
     * @property {Object|null} result The retrieved role record or null if not found.
     * @property {string|null} error Error message if the query fails or data is not found.
     * created by: Rogendher Keith Lachica
     * updated at: September 19 2025 1:04 pm  
     */
    static async getRoleById(role_id) {
        const response_data = { ...STATUS_QUERY };

        try {
            const [get_role_by_id_result] = await db.execute(`
                SELECT * 
                FROM employee_role_types 
                WHERE id = ?
            `, [role_id]);

            if(get_role_by_id_result.length === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_GET_ROLE_BY_ID_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_role_by_id_result[0];
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all employee IDs associated with a given role ID.
     *
     * - Queries the `employees` table where `employee_role_type_id` matches.
     * - Returns a list of employee IDs or an error if none found.
     *
     * @param {number} role_id The role ID to search employees by.
     * @returns {Promise<Object>} An object containing status, result (array), and error if any.
     * created by: Rogendher Keith Lachica
     * updated at: September 25 2025 12:55 am
     */
    static async getRoleByIdEmployee(role_id) {
        const response_data = { ...STATUS_QUERY };

        try {
            const [employees] = await db.execute(`
                SELECT id 
                FROM employees 
                WHERE employee_role_type_id = ?
          `, [role_id]);

            if(employees.length === 0){
                response_data.status = false;
                response_data.result = [];
                response_data.error = GET_ROLE_BY_EMPLOYEE;
            }
            else{
                response_data.status = true;
                response_data.result = employees;
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

}

export default EmployeeRoleTypeModel;
