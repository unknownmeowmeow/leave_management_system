import db from "../config/database.js";



class LeaveRuleType{

    /**
     * Retrieves a leave type rule by its ID.
     * @param {number} rule_id - The ID of the leave type rule to retrieve.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing status, rule data array, or error message.
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getRuleById(rule_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_rule_id] = await db.execute(`
                SELECT id, rule_name
                FROM leave_type_rules
                WHERE id = ?
            `, [rule_id]);

            if(get_rule_id.length){
                response_data.status = true;
                response_data.result = get_rule_id;
            } 
            else{
                response_data.error = "Rule not found.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }
}

export default LeaveRuleType;
