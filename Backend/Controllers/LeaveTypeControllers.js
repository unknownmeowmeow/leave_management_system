import LeaveTypeModel from "../Models/LeaveTypeModel.js";
import { SESSION_USER_NOT_FOUND, ERROR_IN_LEAVE_TYPE_CATCH } from "../Constant/Constants.js";

class LeaveTypeController{

    static async getAllDefaultLeaveType(req, res){
        try {
            const user = req.session?.user;
    
            if(!user){
                return res.json(SESSION_USER_NOT_FOUND); 
            }
            const result = await LeaveTypeModel.getAllLeaveDefaultType(); 
    
            if(!result.status){
                return res.json({ success: false, message: result.error }); 
            }
    
            return res.json({ success: true, data: result.result });
        } 
        catch(error){ 
            return res.json(ERROR_IN_LEAVE_TYPE_CATCH);        
        }
    }
    
    static async getAllRewardedAndSpecialLeave(req, res){
        
        try{
            const user = req.session?.user;
    
            if(!user){
                return res.json(SESSION_USER_NOT_FOUND);
            }
            const result = await LeaveTypeModel.getAllSpecialAndRewardedLeaveType();
    
            if(!result.status){
                return res.json({ success: false, message: result.error });
            }

            return res.json({ success: true, data: result.result });
        } 
        catch(error){
            return res.json(ERROR_IN_LEAVE_TYPE_CATCH);
        }
    }
}

export default LeaveTypeController;
