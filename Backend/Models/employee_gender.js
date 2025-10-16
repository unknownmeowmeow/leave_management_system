import db from "../config/database.js";

class EmployeeGenderModel{
    constructor(connection = db) {
        this.db = connection;
    }
    
    /**
<<<<<<< HEAD
     * Retrieves a gender record by its ID from the database.
     * @param {number} id - The ID of the gender record.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async getGenderId(id = null ){
        const response_data = { status: false, result: null, error: null };


=======
     * Retrieves a gender record from the database by its ID.
     *
     * @param {number} id - The ID of the gender to retrieve.
     * @returns {Object} response_data - Object containing:
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */ 
    static async getGenderById(id){
        const response_data =  { status: false, result: null, error: null };
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

        try{
            const [get_gender_id] = await this.db.execute(`
                SELECT * 
                FROM employee_genders 
                WHERE (? IS NULL OR id = ?)
            `, [id, id]);

            if(get_gender_id.length){
                response_data.status = true;
                response_data.result = get_gender_id;
            } 
            else{
                response_data.error = "Gender Record Not Found";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }


}

export default new EmployeeGenderModel(); 
