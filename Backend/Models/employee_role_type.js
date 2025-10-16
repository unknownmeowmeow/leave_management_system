import db from "../config/database.js";

<<<<<<< HEAD
class EmployeeRoleTypeModel{
    constructor(connection = db){
        this.db = connection;
    }
    
=======
class EmployeeRoleType{
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    /**
     * Retrieves a role type record from the database by its ID.
     * @param {number} role_id - The ID of the role to retrieve.
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
=======
     * @returns {Promise<Object>} response_data - Contains:
     * created by: Rogendher Keith Lachica
     * updated at: September 19, 2025 1:04 PM  
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
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

<<<<<<< HEAD
}

export default new EmployeeRoleTypeModel(); 
=======
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
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
