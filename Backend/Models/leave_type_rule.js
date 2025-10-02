import db from "../Configs/database.js";
import { NUMBER } from "../Constant/constants.js";


class LeaveTypeRuleModel{

    /**
     * Retrieves a leave type rule by its ID.
     *
     * @param {number} rule_id
     * @returns {Promise<{status: boolean, result: Object|null, error: string|null}>}
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 10:30 am
     */
    static async getRuleById(rule_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_rule_id_result] = await db.execute(`
                SELECT id, rule_name
                FROM leave_type_rules
                WHERE id = ?
            `, [rule_id]);

            if(get_rule_id_result.length){
                response_data.error = "Rule not found.";
            } 
            else{
                response_data.status = true;
                response_data.result = get_rule_id_result[NUMBER.zero];
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.error = error.message;
        }

        return response_data;
    }
}

export default LeaveTypeRuleModel;
