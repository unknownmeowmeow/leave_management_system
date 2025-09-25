import db from "../Configs/Database.js";
import { STATUS_QUERY, ERROR_IN_GRANT_TYPE_MODEL } from "../Constant/Constants.js";

class LeaveTypeGrantModel{

    /**
     * Retrieves a grant type by its name.
     *
     * - Executes a query to find a grant type with the provided name.
     * - Returns the matched grant type object if found.
     * - Handles cases where no grant type is found or an error occurs.
     *
     * @param {string} name Grant type name to search for.
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async getGrantTypeName(name){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_grant_type_result] = await db.execute(`
                SELECT id, name 
                FROM leave_type_grant_types 
                WHERE name = ?
            `, [name]);

            if(get_grant_type_result.length === 0){
                response_data.status = false;
                response_data.error = ERROR_IN_GRANT_TYPE_MODEL;
            } 
            else{
                response_data.status = true;
                response_data.result = get_grant_type_result[0];
                
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }
        return response_data;
    }

}

export default LeaveTypeGrantModel; 
