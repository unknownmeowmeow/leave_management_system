import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../Constant/Constants.js";

class LeaveTypeModel{
    /**
     * Get all leave types where is_carried_over = ? and is_active = ?
     * @param {number} is_carried_over
     * @param {number} is_active
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     */
    static async getAllCarryOverLeaveTypes(is_carried_over = 1, is_active = 1){
        const response_data = { ...STATUS_QUERY };

        try {
            const [get_all_carry_over_leave_type_result] = await db.execute(`
                    SELECT id, base_value 
                    FROM leave_types 
                    WHERE is_carried_over = ? AND is_active = ?
                `, [is_carried_over, is_active]
            );

            if(!get_all_carry_over_leave_type_result.length === 0){
                response_data.status = false;
                response_data.result = [];
                response_data.error = "No carry over leave type found";
            } 
            else{
                response_data.status = true;
                response_data.result = get_all_carry_over_leave_type_result;
                
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }
}

export default LeaveTypeModel;
