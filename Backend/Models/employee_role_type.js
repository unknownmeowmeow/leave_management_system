import db from "../Configs/database.js";

class EmployeeRoleTypeModel{
    /**
     * Retrieves a role record by its ID.
     *
     * Workflow:
     * 1. Executes a SQL SELECT query to fetch the role from `employee_role_types` by `id`.
     * 2. If a role is found, returns status `true` with the role data.
     * 3. If no role is found, returns status `false` with an error message.
     * 4. Catches and handles any database errors.
     *
     * @param {number} role_id - The ID of the role to retrieve.
     * @returns {Promise<Object>} response_data - Contains:
     *    - status: Boolean indicating success or failure.
     *    - result: Array with the role record if successful.
     *    - error: Error message if not found or on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 19, 2025 1:04 PM  
     */
    static async getRoleTypeById(role_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_role_by_id_result] = await db.execute(`
                SELECT * 
                FROM employee_role_types 
                WHERE id = ?
            `, [role_id]);

            if(get_role_by_id_result.length){
                response_data.status = true;
                response_data.result = get_role_by_id_result;
            } 
            else{
                response_data.error = "role record not found in model";
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.result = null;
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves all employee IDs associated with a given role ID.
     *
     * Workflow:
     * 1. Executes a SQL SELECT query to fetch employee IDs where `employee_role_type_id` matches the given role ID.
     * 2. If employees are found, returns status `true` with the list of employee IDs.
     * 3. If no employees are found, returns status `false` with an error message.
     * 4. Catches and handles any database errors.
     *
     * @param {number} role_id - The role ID to search employees by.
     * @returns {Promise<Object>} response_data - Contains:
     *    - status: Boolean indicating success or failure.
     *    - result: Array with employee IDs if successful.
     *    - error: Error message if none found or on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: September 25, 2025 12:55 AM
     */
    static async getRoleByIdEmployee(role_id){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_role_by_id_employee_result] = await db.execute(`
                SELECT 
                    id 
                FROM 
                    employees 
                WHERE 
                    employee_role_type_id = ?
            `, [role_id]);

            if(get_role_by_id_employee_result.length){
                response_data.status = true;
                response_data.result = get_role_by_id_employee_result;
            } 
            else{
                response_data.error = "No employees found for the given role in model.";
            }
        } 
        catch(error){
            response_data.status = false;
            response_data.result = null;
            response_data.error = error.message;
        }

        return response_data;
    }
}

export default EmployeeRoleTypeModel;
