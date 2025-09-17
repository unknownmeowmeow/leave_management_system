import db from "../Configs/Database.js";
import { ACTIVE_STATUS, STATUS_QUERY } from "../Constant.js";

class RoleModel {
    
    static async getAllRoles() {
        let response_data = { ...STATUS_QUERY }; 

        try {
            const [get_all_role_result] = await db.execute(`
                SELECT * 
                FROM roles 
                WHERE status_id = ?
            `, [ACTIVE_STATUS]
            );

            if(get_all_role_result && get_all_role_result.length){
                response_data.status = true;
                response_data.result = get_all_role_result;
            } 
            else {
                response_data.status = true;
                response_data.result = [];
                response_data.error = "No roles found";
            }
        } 
        catch(error){
            response_data.error = error.message || error;
        }

        return response_data;
    }
}

export default RoleModel;
