import db from "../Configs/Database.js";
import { STATUS_QUERY, ERROR_IN_LEAVE_FILE_TRANSACTION_MODEL } from "../Constant/Constants.js"

class leaveTransactionModel{
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
            const [get_all_leave_file_result] = await db.execute(`
                    SELECT *    
                    FROM leave_transactions 
                    WHERE id = ?
                `, [id]
            );

            if(!get_all_leave_file_result && get_all_leave_file_result.length === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = ERROR_IN_LEAVE_FILE_TRANSACTION_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_leave_file_result[0];
            }
        }
        catch (error){

        }
    }
}
export default leaveTransactionModel;