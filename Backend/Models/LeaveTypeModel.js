import db from "../Configs/Database.js";
import {
    STATUS_QUERY, ERROR_IN_CARRY_OVER_LEAVE_TYPE_MODEL,
    LEAVE_STATUS, IS_CARRIED_OVER, ERROR_IN_LEAVE_DEFAULT_MODEL, GRANT_TYPE_ID_DEFAULT,
    GRANT_TYPE_ID_SPECIAL, GRANT_TYPE_ID_REWARDED
} from "../Constant/Constants.js";

class LeaveTypeModel{

    /**
     * Retrieves all active leave types that are marked as carried over.
     *
     * - Filters leave types based on is_carried_over and is_active flags.
     * - Returns list of eligible leave types or error if none found.
     *
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async getAllCarryOverLeaveTypes(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_carry_over_leave_type_result] = await db.execute(`
                    SELECT id, base_value 
                    FROM leave_types 
                    WHERE is_carried_over = ? AND is_active = ?
                `, [IS_CARRIED_OVER.yes, LEAVE_STATUS.active]
            );

            if(get_all_carry_over_leave_type_result.length === 0){
                response_data.status = false;
                response_data.result = [];
                response_data.error = ERROR_IN_CARRY_OVER_LEAVE_TYPE_MODEL;
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

    /**
     * Retrieves yearly leave types by fixed IDs (1, 2, 6).
     *
     * - These IDs represent predefined yearly leave categories.
     * - Used for initializing or displaying standard yearly leaves.
     *
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async GetYearlyLeaveTypeAdding(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_yearly_leave_type_result] = await db.execute(`
                SELECT * FROM leave_types 
                WHERE id IN (1, 2, 6)
            `);

            if(!get_all_yearly_leave_type_result.length){
                response_data.status = false;
                response_data.result = [];
                response_data.error = ERROR_IN_CARRY_OVER_LEAVE_TYPE_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_yearly_leave_type_result;
            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all active leave types with 'Default' grant type.
     *
     * - Joins leave_types with grant type table for lookup.
     * - Filters using grant type ID and active status.
     *
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async getAllLeaveDefaultType(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_leave_type_by_id_result] = await db.execute(`
                SELECT leave_types.id, leave_types.name
                FROM leave_types
                LEFT JOIN leave_type_grant_types 
                ON leave_types.leave_type_grant_type_id = leave_type_grant_types.id
                WHERE leave_types.leave_type_grant_type_id = ? AND leave_types.is_active = ?
            `, [GRANT_TYPE_ID_DEFAULT, LEAVE_STATUS.active]);

            if(!get_all_leave_type_by_id_result.length){
                response_data.status = false;
                response_data.error = ERROR_IN_LEAVE_DEFAULT_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_leave_type_by_id_result;
            }
        }
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all active leave types categorized as 'Special' or 'Rewarded'.
     *
     * - Uses IN clause to filter by both grant type IDs.
     * - Ensures leave types are active before returning.
     *
     * @returns {Promise<{status: boolean, result: Array|null, error: string|null}>}
     * created by: [Your Name or Team]
     * updated at: September 25 2025
     */
    static async getAllSpecialAndRewardedLeaveType(){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_special_and_rewarded_result] = await db.execute(`
                SELECT leave_types.id, leave_types.name
                FROM leave_types
                LEFT JOIN leave_type_grant_types 
                ON leave_types.leave_type_grant_type_id = leave_type_grant_types.id
                WHERE leave_types.is_active = ?
                AND leave_types.leave_type_grant_type_id IN (?, ?)
            `, [LEAVE_STATUS.active, GRANT_TYPE_ID_REWARDED, GRANT_TYPE_ID_SPECIAL]);

            if(!get_all_special_and_rewarded_result.length){
                response_data.status = false;
                response_data.error = ERROR_IN_LEAVE_DEFAULT_MODEL;
            }
            else{
                response_data.status = true;
                response_data.result = get_all_special_and_rewarded_result;
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
