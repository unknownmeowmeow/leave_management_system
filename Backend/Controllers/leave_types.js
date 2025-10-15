import LeaveTypeModel from "../Models/leave_type.js";

class LeaveTypeController{
    constructor(){
        this.leaveTypeModel = LeaveTypeModel;
    }

    /**
     * Retrieves all default leave types from the system.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing default leave types or an error message.
     * Last Updated At: October 1, 2025 
     * @author Keith
     */
    async allDefaultLeaveType(req, res){
        
        try{
            const get_all_default_leave_record = await this.leaveTypeModel.getDefaultLeave(); 
        
            if(!get_all_default_leave_record.status){
                throw new Error(get_all_default_leave_record.error);
            }

            return res.json({ status: true, result: get_all_default_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, result: error.message });
        }
    }

    /**
     * Retrieves all rewarded and special leave types from the system.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object used to send JSON responses.
     * @returns {Object} JSON response containing rewarded & special leave types or an error message.
     * Last Updated At: October 1, 2025 
     * @author Keith
     */
    async allRewardedLeave(req, res){
        try{
            const get_all_rewarded_special_leave_record = await this.leaveTypeModel.getRewardedLeave(); 

            if(!get_all_rewarded_special_leave_record.status){
                throw new Error(get_all_rewarded_special_leave_record.error);
            }

            return res.json({ status: true, result: get_all_rewarded_special_leave_record.result });
        } 
        catch(error){
            return res.json({ status: false, result: error.message });
        }
    }
}

export default new LeaveTypeController();
