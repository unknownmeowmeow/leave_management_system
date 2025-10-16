import db from "../config/database.js";
import { 
<<<<<<< HEAD
    ATTENDANCE_TYPE_ID, NUMBER,
    ROLE_TYPE_ID
} from "../Constant/constants.js";
=======
    ATTENDANCE_TYPE_ID, NUMBER
} from "../constant/constants.js";
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

class AttendanceModel{
    constructor(connection = db){
        this.db = connection; 
    }

    /**
     * Inserts a "time in" attendance record for an employee into the database.
<<<<<<< HEAD
     * @param {Object} update_time_in - Object containing employee_id and optional attendance_type_id
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    async insertEmployeeTimeIn(update_time_in){
=======
     * @param {Object} param0 - Object containing:
     *    @param {number} employee_id - The ID of the employee.
     *    @param {number} [attendance_type_id=ATTENDANCE_TYPE_ID.time_in] - The attendance type ID, defaulting to "time in".
     * @returns {Promise<Object>} response_data - Object containing:
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */
    static async insertEmployeeTimeInAttendance(time_in_data){
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        const response_data =  { status: false, result: null, error: null };
        const { employee_id, attendance_type_id = ATTENDANCE_TYPE_ID.time_in } = time_in_data;

        try{
            const [insert_time_in] = await this.db.query(
                `INSERT INTO attendances SET ?`,
                [update_time_in]
            );
            
            if(insert_time_in.insertId){
                response_data.status = true;
                response_data.result = { id: insert_time_in.insertId };
            }
            else{
                response_data.error = "Inserting Failed in time";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

     /**
     * Retrieves the latest "time in" record for an employee for the current date.
     * @param {number} employee_id - The ID of the employee.
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
=======
     * @returns {Promise<Object>} response_data - Object containing:
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async checkLatestTimeIn(employee_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_employee_time_in] = await this.db.execute(`
                SELECT id, time_in 
                FROM attendances
                WHERE employee_id = ? 
                AND DATE(time_in) = CURRENT_DATE()
                ORDER BY id DESC 
                LIMIT ${NUMBER.one}
            `, [employee_id]);

            if(get_employee_time_in.length){
                response_data.status = true;
                response_data.result = get_employee_time_in[NUMBER.zero];
            }
            else{
                response_data.error = "No Time in Record Found";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Retrieves the latest "time out" record for an employee for the current date.
     * @param {number} employee_id - The ID of the employee.
<<<<<<< HEAD
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
=======
     * @returns {Object} response_data - Object containing:
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async checkLatestTimeOut(employee_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_employee_time_out] = await this.db.execute(`
                SELECT id, time_out 
                FROM attendances
                WHERE employee_id = ? 
                AND DATE(time_out) = CURRENT_DATE()
                ORDER BY id DESC 
            `, [employee_id]);

            if(get_employee_time_out.length){
                response_data.status = true;
                response_data.result = get_employee_time_out[NUMBER.zero];
            }
            else{
                response_data.error = "No Time-out Record Found";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
<<<<<<< HEAD
     * Updates the "time out" attendance record for an employee.
     * @param {Object} param0 - Object containing id, time_out, work_hour, and attendance_type_id
     * @param {number} param0.id - Attendance record ID to update.
     * @param {string} param0.time_out - Time out value.
     * @param {number} param0.work_hour - Total worked hours.
     * @param {number} param0.attendance_type_id - Attendance type ID.
     * @param {object} [param0.connection=this.db] - Optional DB connection.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    async updateEmployeeTimeOut( employee_time_out, attendance_id, connection = this.db ){
=======
     * Updates an employee's "time out" attendance record with the specified details.
     * @param {Object} param0 - Object containing:
     *    @param {number} id - The ID of the attendance record to update.
     *    @param {string|Date} time_out - The time out value to set.
     *    @param {number} work_hour - The calculated work hours.
     *    @param {number} attendance_type_id - The attendance type identifier.
     *    @param {Object} [connection=db] - Optional database connection for transaction support.
     * @returns {Object} response_data - Object containing:
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
     */

    static async updateEmployeeTimeOutAttendance(update_attendance, connection = db){
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        const response_data =  { status: false, result: null, error: null };
        const { time_out, work_hour, attendance_type_id, id } = update_attendance;

        try{
            const [update_time_out] = await connection.execute(`
                UPDATE attendances
                SET 
                    time_out = ?, 
                    work_hour = ?, 
                    attendance_type_id = ?
                WHERE id = ?
<<<<<<< HEAD
            `, [ employee_time_out.time_out, employee_time_out.work_hour, employee_time_out.attendance_type_id, attendance_id ]);
=======
            `, [time_out, work_hour,attendance_type_id, id]);
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06

            if(update_time_out.affectedRows){
                response_data.status = true;
                response_data.result = update_time_out;
            }
            else{
                response_data.error = "No Affected row in Update Time-out Attendance";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

     
    /**
<<<<<<< HEAD
     * Retrieves all employees' time-in and time-out attendance records.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
=======
     * Retrieves all employee attendance records including time in and time out details,
     * along with the employee's first and last names.
     * @returns {Object} response_data - Object containing:
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getAllEmployeeAttendance(){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_all_employee_attendance] = await this.db.execute(`
                SELECT *,
                    employees.first_name,
                    employees.last_name
                FROM attendances
                LEFT JOIN employees ON attendances.employee_id = employees.id
                ORDER BY attendances.id DESC
            `);

            if(get_all_employee_attendance.length){
                response_data.status = true;
                response_data.result = get_all_employee_attendance;
            }
            else{
                response_data.error = "No Attendance Record Found";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
<<<<<<< HEAD
     * Retrieves all time-in and time-out attendance records for a specific employee.
     * @param {number} employee_id - The ID of the employee.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
=======
     * Retrieves all time in and time out attendance records for a specific employee,
     * including the employee's first and last names.
     * @param {number} employee_id - The ID of the employee to fetch attendance records for.
     * @returns {Object} response_data - Object containing:
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 03:18 PM
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
     */
    async getEmployeeAttendance(employee_id){
        const response_data =  { status: false, result: null, error: null };

        try{
            const [get_attendance_employee_id] = await this.db.execute(`
                SELECT *
                FROM attendances
                LEFT JOIN employees ON attendances.employee_id = employees.id
                WHERE attendances.employee_id = ?
                ORDER BY attendances.id DESC
            `, [employee_id]);

            if(get_attendance_employee_id.length){
                response_data.status = true;
                response_data.result = get_attendance_employee_id;
            }
            else{
                response_data.error =  "No Employee Attendance Records Found";
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        
        return response_data;
    }

    /**
     * Retrieves employees who reached a qualified attendance count.
     * @param {number} [qualified_attendance=248] - Minimum required attendance.
     * @param {number} [role_type_id=ROLE_TYPE_ID.employee] - Role type ID.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    async getQualifiedEmployee(quealified_gain_employee){
        const response_data = { status: false, result: null, error: null };

        try{
            const [qualified_employee] = await this.db.execute(`
                SELECT attendances.employee_id AS employee_id
                FROM attendances
                INNER JOIN employees 
                ON attendances.employee_id = employees.id
                WHERE employees.employee_role_type_id = ?
                GROUP BY attendances.employee_id
                HAVING COUNT(attendances.id) >= ?
            `, [quealified_gain_employee.role_type_id, quealified_gain_employee.qualified_attendance]);
    
            if(qualified_employee.length){
                response_data.status = true;
                response_data.result = qualified_employee; 
            } 
            else {
                response_data.error = "No employees reached the required attendances.";
            }
    
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
    /**
     * Retrieves all employees who met the monthly attendance requirement.
     * @param {number} required_count - Minimum required attendance count.
     * @param {number} role_type_id - Role type ID.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    async getMonthlyAttendance(monthly_attendance) {
        const response_data = { status: false, result: null, error: null };
        const { required_count, role_type_id } = monthly_attendance;
        
        try {
            const [get_monthly_attendance] = await this.db.execute(`
                SELECT attendances.employee_id, COUNT(attendances.id)
                FROM attendances 
                JOIN employees  ON attendances.employee_id = employees.id
                WHERE employees.employee_role_type_id = ?
                GROUP BY attendances.employee_id
                HAVING COUNT(attendances.id) >= ?
            `, [role_type_id, required_count]);
    
            if(get_monthly_attendance.length){
                response_data.status = true;
                response_data.result = get_monthly_attendance;
            } 
            else{
                response_data.error = 'No employees reached the required attendances.';
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }
    
}

export default new AttendanceModel(); 
