import db from "../Configs/database.js";



class LeaveTypeRuleModel{

    /**
     * Retrieves a leave type rule by its ID.
     *
     * Workflow:
     * 1. Executes a SELECT query to find the leave type rule with the specified ID.
     * 2. If found, returns status `true` with the rule data.
     * 3. If not found, returns status `false` with an error message.
     * 4. Handles any database or execution errors gracefully.
     *
     * @param {number} rule_id - The ID of the leave type rule to retrieve.
     * @returns {Promise<{status: boolean, result: Array<Object>|null, error: string|null}>} Response containing status, rule data array, or error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 2 2025 9:30 am
     */
    static async getRuleById(rule_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_rule_id_result] = await db.execute(`
                SELECT 
                    id, 
                    rule_name
                FROM 
                    leave_type_rules
                WHERE 
                    id = ?
            `, [rule_id]);

            if(get_rule_id_result.length){
                response_data.status = true;
                response_data.result = get_rule_id_result;
            } 
            else{
                response_data.error = "Rule not found.";
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
