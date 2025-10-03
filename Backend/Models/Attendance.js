import db from "../Configs/database.js";
import { ATTENDANCE_TYPE_ID,
    NUMBER
} from "../Constant/constants.js";

class AttendanceModel{

    /**
     * Inserts a "time in" attendance record for an employee into the database.
     * @param {Object} param0 - Object containing:
     *    @param {number} employee_id - The ID of the employee.
     *    @param {number} [attendance_type_id=ATTENDANCE_TYPE_ID.time_in] - The attendance type ID, defaulting to "time in".
     * @returns {Promise<Object>} response_data - Object containing:
     *    - status: Boolean indicating success or failure.
     *    - result: Inserted record info (ID) if successful.
     *    - error: Error message if failed.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */
    static async insertEmployeeTimeInAttendance({ employee_id, attendance_type_id = ATTENDANCE_TYPE_ID.time_in }){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [insert_time_in] = await db.execute(`
                INSERT INTO attendances (
                    employee_id, 
                    attendance_type_id, 
                    time_in, 
                    created_at
                )
                VALUES (?, ?, NOW(), NOW())
            `, [employee_id, attendance_type_id]);

            if(insert_time_in.insertId){
                response_data.status = true;
                response_data.result = { id: insert_time_in.insertId };
            }
            else{
                response_data.error = "inserting failed in time in model";
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
     * Retrieves the latest "time in" attendance record for an employee on the current date.
     *
     * @param {number} employee_id - The ID of the employee.
     * @returns {Promise<Object>} response_data - Object containing:
     *    - status: Boolean indicating success or failure.
     *    - result: Array with the latest time in record if successful.
     *    - error: Error message if failed or no record found.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */
    static async checkEmployeeLatestTimeIn(employee_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_employee_time_in] = await db.execute(`
                SELECT id, time_in 
                FROM attendances
                WHERE employee_id = ? AND DATE(time_in) = CURRENT_DATE()
                ORDER BY id DESC 
                LIMIT ${NUMBER.one}
            `, [employee_id]);

            if(get_employee_time_in.length){
                response_data.status = true;
                response_data.result = get_employee_time_in[0];
            }
            else{
                response_data.error = "no time in record found in model";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves the latest "time out" attendance record for an employee on the current date.
     *
     * @param {number} employee_id - The ID of the employee.
     * @returns {Object} response_data - Object containing:
     *    - status: Boolean indicating success or failure.
     *    - result: Array with the latest time out record if successful.
     *    - error: Error message if failed or no record found.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */

    static async checkLatestEmployeeTimeOut(employee_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_employee_time_out] = await db.execute(`
                SELECT id, time_out 
                FROM attendances
                WHERE employee_id = ? AND DATE(time_out) = CURRENT_DATE()
                ORDER BY id DESC 
            `, [employee_id]);

            if(get_employee_time_out.length){
                response_data.status = true;
                response_data.result = get_employee_time_out;
            }
            else{
                response_data.error = "no time out record found in model";
            }
        }
        catch (error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Updates an employee's "time out" attendance record with the specified details.
     * @param {Object} param0 - Object containing:
     *    @param {number} id - The ID of the attendance record to update.
     *    @param {string|Date} time_out - The time out value to set.
     *    @param {number} work_hour - The calculated work hours.
     *    @param {number} attendance_type_id - The attendance type identifier.
     *    @param {Object} [connection=db] - Optional database connection for transaction support.
     * @returns {Object} response_data - Object containing:
     *    - status: Boolean indicating success or failure.
     *    - result: Update operation result if successful.
     *    - error: Error message if update failed or no row affected.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */

    static async updateEmployeeTimeOutAttendance({ id, time_out, work_hour, attendance_type_id, connection = db }){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [update_time_out] = await connection.execute(`
                UPDATE attendances
                SET 
                    time_out = ?, 
                    work_hour = ?, 
                    attendance_type_id = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [time_out, work_hour, attendance_type_id, id]);

            if(update_time_out.affectedRows){
                response_data.status = true;
                response_data.result = update_time_out;
            }
            else{
                response_data.error = "no affected row in updatetime out attendance in model";
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
     * Retrieves all employee attendance records including time in and time out details,
     * along with the employee's first and last names.
     * @returns {Object} response_data - Object containing:
     *    - status: Boolean indicating success or failure.
     *    - result: Array of attendance records with employee details if successful.
     *    - error: Error message if no records found or on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */

    static async getAllEmployeeTimeInAndTimeOut(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_all_employee_attendance] = await db.execute(`
                SELECT 
                    attendances.employee_id, 
                    attendances.time_in, 
                    attendances.time_out, 
                    employees.first_name, 
                    employees.last_name
                FROM attendances
                LEFT JOIN employees ON attendances.employee_id = employees.id
                ORDER BY attendances.updated_at DESC
            `);

            if(get_all_employee_attendance.length){
                response_data.status = true;
                response_data.result = get_all_employee_attendance;
            }
            else{
                response_data.error = "no attendance records found in model";
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
     * Retrieves all time in and time out attendance records for a specific employee,
     * including the employee's first and last names.
     * @param {number} employee_id - The ID of the employee to fetch attendance records for.
     * @returns {Object} response_data - Object containing:
     *    - status: Boolean indicating success or failure.
     *    - result: Array of attendance records if successful.
     *    - error: Error message if no records found or on failure.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */
    static async getAllTimeInAndTimeOutByEmployeeId(employee_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_attendance_by_employee_id] = await db.execute(`
                SELECT 
                    attendances.employee_id, 
                    attendances.time_in, 
                    attendances.time_out, 
                    employees.first_name, 
                    employees.last_name
                FROM attendances
                LEFT JOIN employees ON attendances.employee_id = employees.id
                WHERE attendances.employee_id = ?
                ORDER BY attendances.updated_at DESC
            `, [employee_id]);

            if(get_attendance_by_employee_id.length){
                response_data.status = true;
                response_data.result = get_attendance_by_employee_id;
            }
            else{
                response_data.error =  "no employee attendance records found in model";
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }
}

export default AttendanceModel;
