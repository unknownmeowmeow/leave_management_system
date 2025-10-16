import db from "../Configs/database.js";

class EmployeeGenderModel{
    constructor(connection = db) {
        this.db = connection;
    }
    
    /**
     * Retrieves a gender record by its ID from the database.
     * @param {number} id - The ID of the gender record.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 14, 2025
     * @author Keith
     */
    async getGenderId(id = null ){
        const response_data = { status: false, result: null, error: null };



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
