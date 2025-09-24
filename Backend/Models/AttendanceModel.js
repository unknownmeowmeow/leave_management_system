import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../Constant/Constants.js";

class AttendanceModel{

    /**
    * Inserts a time-in record for an employee.
    * @param {Object} param0 - Contains employee_id and optional attendance_type_id.
    * @returns {Promise<Object>} - Status, result, and error message if any.
    * created by: rogendher keith lachica
    * updated at: September 23 2025 1:21 pm  
    */
    static async insertEmployeeTimeInAttendance({ employee_id, attendance_type_id = 1 }){
        const response_data = { ...STATUS_QUERY };
        
        try{
            const [insert_attendance_result] = await db.execute(`
                INSERT INTO attendances (
                    employee_id, 
                    attendance_type_id, 
                    time_in, 
                    created_at, 
                    updated_at
                )
                VALUES (?, ?, NOW(), NOW(), NOW())
            `, [employee_id, attendance_type_id]);

            if(!insert_attendance_result.insertId){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "inserting failed in time in model";
            }
            else{
                response_data.status = true;
                response_data.result = { id: insert_attendance_result.insertId };
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
    * Checks the latest time-in record for an employee on the current date.
    * @param {number} employee_id - The ID of the employee.
    * @returns {Promise<Object>} - Status, result, and error message if any.
    * created by: rogendher keith lachica
    * updated at: September 23 2025 1:42 pm  
    */
    static async checkEmployeeLatestTimeIn(employee_id){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_latest_time_in_record] = await db.execute(`
                SELECT id, time_in 
                FROM attendances
                WHERE employee_id = ? AND DATE(time_in) = CURRENT_DATE()
                ORDER BY id DESC LIMIT 1
            `, [employee_id]);

            if(!get_latest_time_in_record.length){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "no time in record found";
            }
            else{
                response_data.status = true;
                response_data.result = get_latest_time_in_record[0];
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
    * Checks the latest time-out record for an employee on the current date.
    * @param {number} employee_id - The ID of the employee.
    * @returns {Promise<Object>} - Status, result, and error message if any.
    * created by: rogendher keith lachica
    * updated at: September 23 2025 2:53 pm  
    */
    static async checkLatestEmployeeTimeOut(employee_id){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_latest_time_out] = await db.execute(`
                SELECT id, time_out 
                FROM attendances
                WHERE employee_id = ? AND DATE(time_out) = CURRENT_DATE()
                ORDER BY id DESC LIMIT 1
            `, [employee_id]);

            if(!get_latest_time_out.length){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "no time out record found";
            }
            else{
                response_data.status = true;
                response_data.result = get_latest_time_out[0];
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
    * Updates the time-out, work hour, and attendance type for a specific attendance record.
    * @param {Object} param0 - Contains id, time_out, work_hour, and attendance_type_id.
    * @returns {Promise<Object>} - Status, result, and error message if any.
    * created by: rogendher keith lachica
    * updated at: September 23 2025 3:15 pm  
    */
    static async updateEmployeeTimeOutAttendance({ id, time_out, work_hour, attendance_type_id }){
        const response_data = { ...STATUS_QUERY };
    
        try{
            const [update_time_out_result] = await db.execute(`
                UPDATE attendances
                SET time_out = ?, work_hour = ?, attendance_type_id = ?, updated_at = NOW()
                WHERE id = ?
            `, [time_out, work_hour, attendance_type_id, id]);
    
            if(update_time_out_result.affectedRows === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "error in model no affected row in updating time out";
            } 
            else{
                response_data.status = true;
                response_data.result = update_time_out_result;
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
    * Retrieves all attendance records for a specific employee.
    * @param {number} employee_id - The ID of the employee.
    * @returns {Promise<Object>} - Status, result, and error message if any.
    * created by: rogendher keith lachica
    * updated at: September 23 2025 3:38 pm  
    */
    static async getAllEmployeeRecord(employee_id){
        const response_data = { ...STATUS_QUERY };

        try{
            const [get_all_employee_attendance_result] = await db.execute(`
                SELECT 
                    attendances.employee_id, 
                    attendances.time_in, 
                    attendances.time_out, 
                    employees.first_name, 
                    employees.last_name
                FROM attendances
                LEFT JOIN employees 
                ON attendances.employee_id = employees.id
                WHERE attendances.employee_id = ?
                ORDER BY attendances.updated_at DESC;
            `, [employee_id]);

            if(get_all_employee_attendance_result.length === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "no attendance records found for this employee";
            } 
            else{
                response_data.status = true;
                response_data.result = get_all_employee_attendance_result;
            }
        }
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }

    /**
    * Retrieves all attendance records for all employees.
    * @returns {Promise<Object>} - Status, result, and error message if any.
    * created by: rogendher keith lachica
    * updated at: September 24 2025 1:26 pm  
    */
    static async getAllEmployeesRecords(){
        const response_data = { ...STATUS_QUERY };
    
        try{
            const [get_all_employee_attendance_result] = await db.execute(`
                SELECT 
                    attendances.employee_id, 
                    attendances.time_in, 
                    attendances.time_out, 
                    employees.first_name, 
                    employees.last_name
                FROM attendances
                LEFT JOIN employees 
                ON attendances.employee_id = employees.id
                ORDER BY attendances.updated_at DESC
            `);
    
            if(get_all_employee_attendance_result.length === 0){
                response_data.status = false;
                response_data.result = null;
                response_data.error = "no attendance records found";
            } 
            else{
                response_data.status = true;
                response_data.result = get_all_employee_attendance_result;
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
        return response_data;
    }
    
}

export default AttendanceModel;
