import LeaveTypeModel from "../Models/LeaveType.js";
import LeaveTransactionModel from "../Models/LeaveTransaction.js";
import database from "../Configs/Database.js";

class AdminLeaveController{

    /**
     * Retrieves all leave transactions of employees.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with leave transactions or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 8:50 am
     */
    static async getAllLeaveTransactions(req, res){

        try{
            const leaves = await LeaveTypeModel.getAllLeaves();

            if(!leaves.status){
                return res.json({ success: false, message: leaves.error });
            }
            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json({ success: false, message: "failed to view all."});
        }
    }

    static async getAllLeaveTransaction(req, res){
        const user = req.session.user;

        if(!user){
            return res.json({ success: false, message: "User session not found." });
        }
        const employee_id = user.employee_id;
        try{
            const leaves = await LeaveTypeModel.getAllLeave(employee_id);

            if(!leaves.status){
                return res.json({ success: false, message: leaves.error });
            }
            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json({ success: false, message: "failed by employee."});
        }
    }
    
    /**
     * Updates the status of a specific leave transaction.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with updated leave transaction or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 8:55 am
     */
    static async updateLeaveStatus(req, res){
        const { leave_id, status_id } = req.body;
        const user = req.session.user;
    
        if(!user){
            return res.json({ success: false, message: "User session not found." });
        }
    
        if(!leave_id || !status_id){
            return res.json({ success: false, message: "Leave ID and status required." });
        }
        const connection = await database.getConnection();
    
        try{
            await connection.beginTransaction();
            const leave_transaction = await LeaveTransactionModel.getLeaveTransactionById(leave_id);

            if(!leave_transaction.status){
                await connection.rollback();
                return res.json({ success: false, message: leave_transaction.error });
            }
            const employee_id = leave_transaction.result.employee_id;
            const total_leave = Number(leave_transaction.result.total_leave);

            if(Number(status_id) === 2){
                const total_credit = await LeaveTransactionModel.getTotalCredit(employee_id);
                
                if(!total_credit.status){
                    await connection.rollback();
                    return res.json({ success: false, message: total_credit.error });
                }
                const available_credit = Number(total_credit.result.total_latest_credit);
    
                if(available_credit <= 0){
                    await connection.rollback();
                    return res.json({ success: false, message: `No credit available: ${available_credit} days.` });
                }
    
                if(available_credit < total_leave){
                    await connection.rollback();
                    return res.json({ success: false, message: `No available credit: ${available_credit} days.` });
                }
                const latest_record = await LeaveTransactionModel.getLatestCreditRecord(employee_id);
                
                if(!latest_record.status){
                    await connection.rollback();
                    return res.json({ success: false, message: latest_record.error });
                }
                const deduction = await LeaveTransactionModel.deductCredit(latest_record.result.id,total_leave,connection
                );
                
                
                if(!deduction.status){
                    await connection.rollback();
                    return res.json({ success: false, message: deduction.error });
                }
            }
            const update_response = await LeaveTransactionModel.updateStatus(leave_id, status_id, user.employee_id, connection);
            
            if(!update_response.status){
                await connection.rollback();
                return res.json({ success: false, message: update_response.error });
            }
    
            await connection.commit();
            return res.json({ success: true, data: update_response.result });
        } 
        catch(error){
            await connection.rollback();
            return res.json({ success: false, message: error.message });
        } 
        finally{
            connection.release();
        }
    }

     /**
     * Retrieves all leave transactions for the logged-in employee.
     *
     * @param {Object} req Express request object.
     * @param {Object} res Express response object.
     * @returns {Object} JSON response with employee leave transactions or error.
     * created by: Rogendher Keith Lachica
     * updated at: September 26 2025 9:00 am
     */
    static async getAllEmployeeLeaveTransaction(req, res){
        const user = req.session.user;

        if(!user){
            return res.json({ success: false, message: "User session not found." });
        }

        try{
            const leaves = await LeaveTypeModel.getAllByEmployeeRecordLeaves(user.employee_id);

            if(!leaves.status){
                return res.json({ success: false, message: leaves.error });
            }
            return res.json({ success: true, data: leaves.result });
        } 
        catch(error){
            return res.json({ success: false, message: "Failed to fetch leave records." });
        }
    }
}

export default AdminLeaveController;
