import db from "../Configs/Database.js";
import { STATUS_QUERY, ERROR_IN_GET_ROLE_BY_ID_MODEL } from "../Constant/Constants.js"

class EmployeeRoleTypeModel {

    /**
     * Get a role record by ID.
     * @param {number} roleId - The ID of the role to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status - Indicates success or failure of the query.
     * @property {Object|null} result - The retrieved role record or null if not found.
     * @property {string|null} error - Error message if the query fails or data is not found.
     * created by: rogendher keith lachica
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
                response_data.error = "No employees found for the given role.";
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
