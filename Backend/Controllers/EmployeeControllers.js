import bcrypt from "bcrypt";
import EmployeeModel from "../Models/EmployeeModel.js";
import { 
    GENDER_MALE, GENDER_FEMALE, ACTIVE_STATUS, MESSAGE_ALL_FIELD_ERROR, MESSAGE_FIRST_NAME_ERROR, 
    MESSAGE_LAST_NAME_ERROR, MESSAGE_ADDRESS_ERROR, MESSAGE_EMAIL_REGEX_ERROR, MESSAGE_CONFIRM_PASSWORD, MESSAGE_PASSWORD_ERROR, 
    MESSAGE_EMAIL_EXIST, MESSAGE_REGISTRATION_MESSAGE, MESSAGE_FAILED_REGISTRATION_MESSAGE, MESSAGE_FAILED_CATCH_IN_REGISTRATION_MESSAGE,
    MESSAGE_EMAIL_NOT_FOUND, MESSAGE_NO_EMPLOYEE_SESSION, MESSAGE_IN_SUCCESS_LOGOUT, MESSAGE_FIRST_NAME_INVALID_CHARACTER,
    MESSAGE_FAILED_CATCH_IN_LOGIN_MESSAGE, MESSAGE_LAST_NAME_INVALID_CHARACTER, MESSAGE_FAILED_CATCH_IN_LOGOUT_MESSAGE
} from "../Constant.js";

class EmployeeControllers{

    static async userRegistration(req, res){

        try{
            const { first_name, last_name, email, password, confirm_password, address, gender, role_id, status_id } = req.body;
            
            if(!first_name || !last_name || !email || !password || !confirm_password || !address || !gender){
                return res.json(MESSAGE_ALL_FIELD_ERROR);
            } 
            else if (!/^[a-zA-Z\s]+$/.test(first_name.trim())) {
                return res.json(MESSAGE_FIRST_NAME_INVALID_CHARACTER);
            }
            else if(first_name.trim().length < 3){
                return res.json(MESSAGE_FIRST_NAME_ERROR);
            } 
            else if (last_name.trim().length < 3) {
                return res.json(MESSAGE_LAST_NAME_ERROR);
            }
            else if (!/^[a-zA-Z\s]+$/.test(last_name.trim())) {
                return res.json(MESSAGE_LAST_NAME_INVALID_CHARACTER);
            }
            else if(address.trim().length < 5){
                return res.json(MESSAGE_ADDRESS_ERROR);
            } 
            else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                return res.json(MESSAGE_EMAIL_REGEX_ERROR);
            } 
            else if(password.trim().length < 8){
                return res.json(MESSAGE_PASSWORD_ERROR);
            } 
            else if(password !== confirm_password){
                return res.json(MESSAGE_CONFIRM_PASSWORD);
            } 
            const email_exist = await EmployeeModel.getEmployeeEmail(email);
            
            if(email_exist.result){
                return res.json(MESSAGE_EMAIL_EXIST);
            }
            let gender_value = null;

            if(gender){
                const ang_kanyang_kasarian = gender.toLowerCase();
                if (ang_kanyang_kasarian === "male") {
                    gender_value = GENDER_MALE;
                } 
                else if(ang_kanyang_kasarian === "female") {
                    gender_value = GENDER_FEMALE;
                }
            }
            let role_value = null;

            if(role_id){
                role_value = parseInt(role_id, 10);
            }
            let status_value = ACTIVE_STATUS; 
            
            if(status_id){
                status_value = parseInt(status_id, 10);
            }
            const hash_password = await bcrypt.hash(password, 12);
    
            const new_user = await EmployeeModel.createUser({
                first_name,
                last_name,
                address,
                gender: gender_value,
                email,
                password: hash_password,
                role_id: role_value,
                status_id: status_value
            });
    
            if(new_user.status){
                return res.json(MESSAGE_REGISTRATION_MESSAGE);
            } 
            else {
                return res.json(MESSAGE_FAILED_REGISTRATION_MESSAGE);
            }
        } 
        catch(error){
            return res.json(MESSAGE_FAILED_CATCH_IN_REGISTRATION_MESSAGE);
        }
    }
    
    
    static async userLogin(req, res) {

        try {
            const { email, password } = req.body;
    
            if(!email || !password){
                return res.json(MESSAGE_ALL_FIELD_ERROR);
            }
            const user_data = await EmployeeModel.getEmployeeEmail(email);

            if(!user_data.result){
                return res.json(MESSAGE_EMAIL_NOT_FOUND);
            }
            const user = user_data.result;
            const match = await bcrypt.compare(password, user.password);

            if(!match){
                return res.json(MESSAGE_CONFIRM_PASSWORD);
            }
            req.session.user = {
                employee_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                gender: user.is_gender,
                role_id: user.role_id,
            };
            return res.json({
                success: true,
                message: "Successfully logged in!",
                role: user.role_id, 
                user: req.session.user
            });
    
        } 
        catch(error){
            return res.json(MESSAGE_FAILED_CATCH_IN_LOGIN_MESSAGE);
        }
    }
    
    static async logout(req, res){

        try {
            if(!req.session.user){
                return res.json(MESSAGE_NO_EMPLOYEE_SESSION);
            } 
            else{
                req.session.destroy(error => {
                    if(error){
                        return res.json();
                    } 
                    else{
                        return res.json(MESSAGE_IN_SUCCESS_LOGOUT);
                    }
                });
            }
        } 
        catch(error){
            return res.json(MESSAGE_FAILED_CATCH_IN_LOGOUT_MESSAGE);
        }
    }
}

export default EmployeeControllers;
