import db from "../Configs/Database.js";

class LeaveTypeRuleModel {

    static async getRuleById(rule_id){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_rule_by_id] = await db.execute(`
                SELECT id, rule_name
                FROM leave_type_rules
                WHERE id = ?
            `, [rule_id]);

            if(get_rule_by_id.length === 0){
                response_data.error = "Rule not found.";
            } 
            else{
                response_data.status = true;
                response_data.result = get_rule_by_id[0];
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }
}

export default LeaveTypeRuleModel;
