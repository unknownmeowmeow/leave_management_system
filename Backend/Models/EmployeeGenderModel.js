import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../constant.js";

class EmployeeGenderModel {
    /**
   * Get all gender records.
   * @returns {Promise<Object>} An object containing the query status, result, and error if any.
   * @property {boolean} status - Indicates success or failure of the query.
   * @property {Array<Object>} result - An array of all gender records.
   * @property {string|null} error - Error message if the query fails.
   */
    static async getAllGenders() {
        const response_data = { ...STATUS_QUERY };

        try {
            const [get_all_gender_result] = await db.execute(`
                SELECT * 
                FROM employee_genders
            `);
            response_data.status = true;
            response_data.result = get_all_gender_result;
        }
        catch (error) {
            response_data.error = error.message || error;
        }
        return response_data;
    }

    /**
     * Get a gender record by ID.
     * @param {number} genderId - The ID of the gender to retrieve.
     * @returns {Promise<Object>} An object containing the query status, result, and error if any.
     * @property {boolean} status - Indicates success or failure of the query.
     * @property {Object|null} result - The retrieved gender record or null if not found.
     * @property {string|null} error - Error message if the query fails or data is not found.
     */
    static async getGenderById(genderId) {
        const response_data = { ...STATUS_QUERY };

        try {
            const [get_gender_by_id_result] = await db.execute(`
            SELECT * 
            FROM employee_genders 
            WHERE id = ?
        `, [genderId]);

            if (get_gender_by_id_result.length) {
                response_data.status = true;
                response_data.result = get_gender_by_id_result[0];
            }
            else {
                response_data.result = null;
            }
        }
        catch (error) {
            response_data.error = error.message || error;
        }

        return response_data;
    }

}

export default EmployeeGenderModel;