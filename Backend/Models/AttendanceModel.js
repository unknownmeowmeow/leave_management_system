import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../constant.js";

class AttendanceModel {

    static async insertEmployeeTimeInAttendance({ employee_id, attendance_type_id = 1 }) {
        const response = { ...STATUS_QUERY };
        
        try {
            const [insert_attendance_result] = await db.execute(`
                INSERT INTO attendances (employee_id, attendance_type_id, time_in, created_at, updated_at)
                VALUES (?, ?, NOW(), NOW(), NOW())
            `, [employee_id, attendance_type_id]);

            if(!insert_attendance_result.insertId){
                response.status = false;
                response.result = null;
                response.error = "inserting failed in time in model";
            }
            else{
                response.status = true;
                response.result = { id: insert_attendance_result.insertId };
            }
        }
        catch(error){
            response.error = error.message;
        }
        return response;
    }

    static async checkEmployeeLatestTimeIn(employee_id) {
        const response = { ...STATUS_QUERY };

        try{
            const [get_latest_time_in_record] = await db.execute(`
                SELECT id, time_in 
                FROM attendances
                WHERE employee_id = ? AND DATE(time_in) = CURRENT_DATE()
                ORDER BY id DESC LIMIT 1
            `, [employee_id]);

            if(!get_latest_time_in_record.length){
                response.status = false;
                response.result = null;
            }
            else{
                response.status = true;
                response.result = get_latest_time_in_record[0];
            }
        }
        catch(error){
            response.error = error.message;
        }

        return response;
    }


    static async updateEmployeeTimeOutAttendance({ id, time_out, work_hour, attendance_type_id }) {
        const response = { ...STATUS_QUERY };
    
        try{
            const [update_time_out_result] = await db.execute(`
                UPDATE attendances
                SET time_out = ?, work_hour = ?, attendance_type_id = ?, updated_at = NOW()
                WHERE id = ?
            `, [time_out, work_hour, attendance_type_id, id]);
    
            if(update_time_out_result.affectedRows === 0){
                response.status = false;
                response.result = null;
                response.error = "error in model no affected row in updating time out";
            } 
            else{
                response.status = true;
                response.result = update_time_out_result;
            }
        }
        catch(error){
            response.error = error.message;
        }
        return response;
    }
    
}

export default AttendanceModel;
