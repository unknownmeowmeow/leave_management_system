import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../constant.js";

class LeaveFileMode{
    /**
     * Get a leave file by ID.
     * @param {number} id - The ID of the leave file to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status - Indicates success or failure of the query.
     * @property {Object|null} result - The retrieved leave file record or null if not found.
     * @property {string|null} error - Error message if the query fails or data is not found.
     */
    static async getAllLeaveFile(){
        const response_data = { ...STATUS_QUERY };

        try {
            const [get_all_email_result] = await db.execute(`
                    SELECT *    
                    FROM leave_transactions 
                    WHERE id = ?
                `, [id]
            );

            if(get_all_email_result && get_all_email_result.length){
                response_data.status = true;
                response_data.result = get_all_email_result[0];
            }
            else{
                response_data.status = true;
                response_data.result = null;
                response_data.error = "failed to fetch email in login model";
            }
        }
        catch (error){

        }
    }
}
export default LeaveFileMode;