import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../constant.js";


class AttendanceModel {

    /**
     * content for inserting data in attendance table in database 
     * created by: rogendher keith lachica
     * updated at: September 19 2025 2:08 pm 
     * @returns response data
     */
    static async InsertAttendanceEmployeeTimeIn() {
        const response_data = { ...STATUS_QUERY };

        try{
            
        }
        catch(error){

        }
        return response_data;
    }
    /**
      * content for updating data in attendance table in database 
      * created by: rogendher keith lachica
      * updated at: September 19 2025 2:08 pm 
      * @returns 
      */
    static async updateAttendanceEmployeeTimeOut() {
        const response_data = { ...STATUS_QUERY };

        try{

        }
        catch(error){

        }

        return response_data;
    }

}

export default AttendanceModel;