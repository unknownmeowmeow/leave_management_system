import db from "../config/database.js";

class EmployeeRoleType{
    /**
     * Retrieves a role record by its ID.
     *
     * @param {number} role_id - The ID of the role to retrieve.
     * @returns {Promise<Object>} response_data - Contains:
     * created by: Rogendher Keith Lachica
     * updated at: September 19, 2025 1:04 PM  
     */
    static async getRoleTypeById(role_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_role_id] = await db.execute(`
                SELECT * 
                FROM employee_role_types 
                WHERE id = ?
            `, [role_id]);

            if(get_role_id.length){
                response_data.status = true;
                response_data.result = get_role_id;
            } 
            else{
                response_data.error = "role record not found in model";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all employee IDs associated with a given role ID.
     *
     * @param {number} role_id - The role ID to search employees by.
     * @returns {Promise<Object>} response_data - Contains:
     * created by: Rogendher Keith Lachica
     * updated at: September 25, 2025 12:55 AM
     */
    static async getRoleByIdEmployee(role_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_employee_role_id] = await db.execute(`
                SELECT id 
                FROM employees 
                WHERE employee_role_type_id = ?
            `, [role_id]);

            if(get_employee_role_id.length){
                response_data.status = true;
                response_data.result = get_employee_role_id;
            } 
            else{
                response_data.error = "No employees found for the given role in model.";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }
}

export default EmployeeRoleType;
