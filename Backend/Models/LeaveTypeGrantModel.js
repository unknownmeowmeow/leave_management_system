import db from "../Configs/Database.js";
import { STATUS_QUERY, ERROR_IN_GRANT_TYPE_MODEL } from "../Constant/Constants.js";

class LeaveTypeGrantModel{
    /**
     * Get grant type by name
     * @param {string} name
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     */
    static async getGrantTypeName(name){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_grant_type_result] = await db.execute(`
                SELECT id, name 
                FROM leave_type_grant_types 
                WHERE name = ?
            `, [name]);

            if(!get_grant_type_result.length === 0){
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
