import db from "../Configs/database.js";

class EmployeeRoleTypeModel{
    constructor(connection = db){
        this.db = connection;
    }
    
    /**
     * Retrieves a role type record from the database by its ID.
     * @param {number} role_id - The ID of the role to retrieve.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    async getRoleTypeId(role_id = null){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_role_id] = await this.db.execute(`
                SELECT * 
                FROM employee_role_types 
                WHERE (? IS NULL OR id = ?)
            `, [role_id, role_id]);

            if(get_role_id.length){
                response_data.status = true;
                response_data.result = get_role_id;
            } 
            else{
                response_data.error = "Role Record not Found";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

}

export default new EmployeeRoleTypeModel(); 
