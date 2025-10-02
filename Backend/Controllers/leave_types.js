import LeaveTypeModel from "../Models/leave_type.js";

class LeaveTypeController{

    /**
     * Retrieves all default leave types from the system.
     *
     * Workflow:
     * 1. **Fetch Default Leave Types**
     *    - Calls `LeaveTypeModel.getAllLeaveDefaultType()` to retrieve default leave types.
     *
     * 2. **Handle Model Response**
     *    - If `result.status` is `false` → return:
     *      `{ success: false, message: <error from model> }`.
     *
     * 3. **Return Success**
     *    - If successful → return:
     *      `{ success: true, data: <Array of default leave types> }`.
     *
     * 4. **Error Handling**
     *    - Any unexpected error caught by `try/catch` will return:
     *      `{ success: false, message: "Error in default Leave type Controllers" }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   data: [
     *     { id: 1, name: "Sick Leave", base_value: 10 },
     *     { id: 2, name: "Vacation Leave", base_value: 15 }
     *   ]
     * }
     *
     * Example Response (Failure - model error):
     * {
     *   success: false,
     *   message: "Database connection failed"
     * }
     *
     * Example Response (Failure - unexpected error):
     * {
     *   success: false,
     *   message: "Error in default Leave type Controllers"
     * }
     *
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
    
            if(!get_all_default_leave_record.status){
               throw new Error("No Default Leave Type Found");
            }
    
            return res.json({ success: true, data: get_all_default_leave_record.result });
        } 
        catch(error){ 
            return res.json({ success: false, message: error.message || "Server error register in controller" });      
        }
    }

    /**
     * Retrieves all rewarded and special leave types from the system.
     *
     * Workflow:
     * 1. **Fetch Rewarded & Special Leave Types**
     *    - Calls `LeaveTypeModel.getAllSpecialAndRewardedLeaveType()` 
     *      to retrieve leave types that are either special or rewarded.
     *
     * 2. **Handle Model Response**
     *    - If `result.status` is `false` → return:
     *      `{ success: false, message: <error from model> }`.
     *
     * 3. **Return Success**
     *    - If successful → return:
     *      `{ success: true, data: <Array of rewarded and special leave types> }`.
     *
     * 4. **Error Handling**
     *    - Any unexpected error caught by `try/catch` will return:
     *      `{ success: false, message: "Error in special and rewarded Leave type Controllers" }`.
     *
     * Example Response (Success):
     * {
     *   success: true,
     *   data: [
     *     { id: 5, name: "Birthday Leave", base_value: 1 },
     *     { id: 6, name: "Service Award Leave", base_value: 3 }
     *   ]
     * }
     *
     * Example Response (Failure - model error):
     * {
     *   success: false,
     *   message: "Database query failed"
     * }
     *
     * Example Response (Failure - unexpected error):
     * {
     *   success: false,
     *   message: "Error in special and rewarded Leave type Controllers"
     * }
     *
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
    
            if(!get_all_rewarded_special_leave_record.status){
               throw new Error("No Rewarded And Special Leave Found");
            }

            return res.json({ success: true, data: get_all_rewarded_special_leave_record.result });
        } 
        catch(error){
            return res.json({ success: false, message: error.message || "Server error register in controller" });
        }
    }
}

export default LeaveTypeController;
