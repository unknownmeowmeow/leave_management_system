import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../Constant/Constants.js"

class EmployeeRoleTypeModel{
    /**
     * Get all role records.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status - Indicates success or failure of the query.
     * @property {Array<Object>} result - An array of all role records.
     * @property {string|null} error - Error message if the query fails.
     * created by: rogendher keith lachica
     * updated at: September 19 2025 1:00 pm  
     */
    static async getAllRoles(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_role_result] = await db.execute(`
                SELECT * 
                FROM employee_role_types
            `);

            if(get_all_role_result.length === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "no role records found";
            } 
            else{
                response_data.status = true;
                response_data.result = get_all_role_result;
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

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
    static async getRoleById(role_id){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_role_by_id_result] = await db.execute(`
                SELECT * 
                FROM employee_role_types 
                WHERE id = ?
            `, [role_id]);

            if(get_role_by_id_result.length === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "role record not found";
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

}

export default EmployeeRoleTypeModel;
