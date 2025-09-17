import db from "../Configs/Database.js";
import { STATUS_QUERY } from "../Constant.js";

class EmployeeModel{

    static async getEmployeeEmail(email) {
        let response_data = { ...STATUS_QUERY }; 
    
        try {
            const [get_all_email_result] = await db.execute(`
                    SELECT *    
                    FROM employees 
                    WHERE email = ?
                `, [email]
            );
    
            if(get_all_email_result && get_all_email_result.length){
                response_data.status = true;
                response_data.result = get_all_email_result[0];   
            } 
            else {
                response_data.status = true;      
                response_data.result = null;
                response_data.error = "failed to fetch email in login model";
            }
        } 
        catch(error){
            response_data.error = error.message || error;
        }
    
        return response_data;
    }

    static async createUser({ role_id, status_id, first_name, last_name, address, email, password, gender }){
        let response_data = { ...STATUS_QUERY }; 

        try{
            const [insert_employee_result] = await db.execute(`
                        INSERT INTO employees (
                            role_id, 
                            status_id, 
                            first_name, 
                            last_name, 
                            is_gender,
                            address, 
                            email, 
                            password,
                            hire_date, 
                            created_at, 
                            updated_at
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())
                `, [role_id, status_id, first_name, last_name, gender, address, email, password]
            );

            if(insert_employee_result.insertId){
                response_data.status = true;
                response_data.insert_employee_result = { id: insert_employee_result.insertId };
            }
            else{
                response_data.error = "failed to insert user data in register model";
            }
        }
        catch(error){
            response_data.error = error.message || error;
        }

        return response_data;
    }

}

export default EmployeeModel;
