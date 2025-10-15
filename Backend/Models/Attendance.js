import db from "../Configs/database.js";
import { 
    ATTENDANCE_TYPE_ID, NUMBER,
    ROLE_TYPE_ID
} from "../Constant/constants.js";

class AttendanceModel{
    constructor(connection = db){
        this.db = connection; 
    }

    /**
     * Inserts a "time in" attendance record for an employee into the database.
     * @param {Object} param0 - Object containing employee_id and optional attendance_type_id
     * @param {number} param0.employee_id - The ID of the employee.
     * @param {number} [param0.attendance_type_id=ATTENDANCE_TYPE_ID.time_in] - Attendance type ID.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    async insertEmployeeTimeIn(update_time_in){
        const response_data =  { status: false, result: null, error: null };
        const { employee_id, attendance_type_id = ATTENDANCE_TYPE_ID.time_in } = update_time_in;

        try{
            const [insert_time_in] = await this.db.execute(`
                INSERT INTO attendances (
                    employee_id, 
                    attendance_type_id, 
                    time_in
                )
                VALUES (?, ?, CURRENT_DATE())
            `, [employee_id, attendance_type_id]);

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
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
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
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
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
    async updateEmployeeTimeOut(update_time_out, connection = this.db ){
        const response_data =  { status: false, result: null, error: null };
        const { id, time_out, work_hour, attendance_type_id } = update_time_out;

        try{
            const [update_time_out] = await connection.execute(`
                UPDATE attendances
                SET 
                    time_out = ?, 
                    work_hour = ?, 
                    attendance_type_id = ?
                WHERE id = ?
            `, [time_out, work_hour, attendance_type_id, id]);

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
     * Retrieves all employees' time-in and time-out attendance records.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
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
     * Retrieves all time-in and time-out attendance records for a specific employee.
     * @param {number} employee_id - The ID of the employee.
     * @returns {Promise<Object>} response_data - Object containing status, result, or error.
     * Last Updated At: October 1, 2025
     * @author Keith
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
    async getQualifiedEmployee(qualified_employee){
        const response_data = { status: false, result: null, error: null };
        const { qualified_attendance = NUMBER.two_hundred_forty_eight, role_type_id = ROLE_TYPE_ID.employee } = qualified_employee;

        try{
            const [qualified_employee] = await this.db.execute(`
                SELECT attendances.employee_id AS employee_id
                FROM attendances
                INNER JOIN employees 
                ON attendances.employee_id = employees.id
                WHERE employees.employee_role_type_id = ?
                GROUP BY attendances.employee_id
                HAVING COUNT(attendances.id) >= ?
            `, [role_type_id, qualified_attendance]);
    
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
