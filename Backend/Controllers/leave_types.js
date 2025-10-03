import LeaveTypeModel from "../Models/leave_type.js";

class LeaveTypeController{

    /**
     * Retrieves all default leave types from the system.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing default leave types or an error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:10 PM
     */
    static async getAllDefaultLeaveType(req, res){
        
        try{
            const get_all_default_leave_record = await LeaveTypeModel.getAllLeaveDefaultType(); 
    
            if(!get_all_default_leave_record.status || get_all_default_leave_record.error){
               throw new Error(get_all_default_leave_record.error);
            }
    
            return res.json({ success: true, data: get_all_default_leave_record.result });
        } 
        catch(error){ 
            return res.json({ success: false, message: error.message || "Server error register in controller" });      
        }
    }

    /**
     * Retrieves all rewarded and special leave types from the system.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing rewarded & special leave types or an error message.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:20 PM
     */
    static async getAllRewardedAndSpecialLeave(req, res){
        
        try{
            const get_all_rewarded_special_leave_record = await LeaveTypeModel.getAllSpecialAndRewardedLeaveType();
    
            if(!get_all_rewarded_special_leave_record.status || get_all_rewarded_special_leave_record.error){
               throw new Error(get_all_rewarded_special_leave_record.error);
            }

            return res.json({ success: true, data: get_all_rewarded_special_leave_record.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error register in controller" });
        }
    }
}

export default LeaveTypeController;
