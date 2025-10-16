import db from "../Configs/database.js";
import { NUMBER, ROLE_TYPE_ID } from "../Constant/constants.js";

class EmployeeModel{
    constructor(connection = db){
        this.db = connection;
    }

    /**
     * Retrieves an employee record by ID.
     * @param {number} employee_id - The ID of the employee to retrieve.
     * @returns {Promise<Object>} response_data - Contains status, result, or error.
     * Last Updated At: September 26, 2025 
     * @author Keith
     */
    async getEmployeeId(employee_data){
        const response_data =  { status: false, result: null, error: null };
        const { employee_id = null, email = null, role_id = null } = employee_data;
        
        try{
            const [get_employee_id] = await this.db.execute(`
                SELECT *
                FROM employees
                WHERE (? IS NULL OR id = ?)
                AND (? IS NULL OR email = ?)
                AND (? IS NULL OR employee_role_type_id = ?)
                LIMIT ${NUMBER.one}
            `, [employee_id, employee_id, email, email, role_id, role_id]);

            if(get_employee_id.length){
                response_data.status = true;
                response_data.result = get_employee_id[NUMBER.zero];
            }
            else{
                response_data.error =  "Employee not Found.";
            }
        }
        catch(error){
            response_data.error = error.message;
        }

        return response_data;
    }

    /**
     * Creates a new employee record.
     * @param {Object} create_employee - The user data to insert.
     * @param {string} create_employee.first_name - First name of the employee.
     * @param {string} create_employee.last_name - Last name of the employee.
     * @param {string} create_employee.email - Email address of the employee.
     * @param {number} create_employee.role - Role ID of the employee.
     * @param {number} create_employee.gender - Gender ID of the employee.
     * @param {string} create_employee.password - Hashed password.
     * @param {Object} [connection=db] - Optional database connection.
     * @returns {Promise<Object>} response_data - Contains status, inserted employee ID, or error.
     * Last Updated At: September 21, 2025 
     * @author Keith
     */
    async createEmployeeAccount(create_employee, connection = this.db) {
        const response_data = { status: false, result: null, error: null };
        
        try{
            const [insert_employee_account] = await connection.query(
                `INSERT INTO employees SET ?`,
                create_employee
            );
            
            if(insert_employee_account.insertId){
                response_data.status = true;
                response_data.result = { id: insert_employee_account.insertId };
            } 
            else{
                response_data.error = "Insert employee data error";
            }
        } 
        catch(error){
            response_data.error = error.message;
        }
    
        return response_data;
    }

     /**
     * Retrieves all employees where role type is intern or employee.
     * @returns {Promise<Object>} response_data - Contains status, result, or error.
     * Last Updated At: September 25, 2025 
     * @author Keith
     */
    async getAllWorker(){
        const response_data = { status: false, result: null, error: null };

        try{
            const [get_all_employee_intern] = await this.db.execute(`
                SELECT *
                FROM employees
                WHERE employee_role_type_id 
                IN (?, ?)
                ORDER BY id DESC
            `, [ROLE_TYPE_ID.intern, ROLE_TYPE_ID.employee]);

            if(get_all_employee_intern.length){
                response_data.status = true;
                response_data.result = get_all_employee_intern;
            }
            else{
                response_data.error = "No employee data Found";
            }
        }
        catch(error){
            response_data.error =  error.message;
        }

        return response_data;
    }
    
}

export default new EmployeeModel();
