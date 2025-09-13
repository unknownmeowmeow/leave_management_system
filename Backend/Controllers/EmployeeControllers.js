import bcrypt from "bcrypt";
import Employee from "../models/authModel.js";

class EmployeeControllers {

    static async userRegistration(req, res) {
        try{
            const { first_name, last_name, email, password, confirm_password, address, gender } = req.body;
    
            if(!first_name || !last_name || !email || !password || !confirm_password || !address || !gender){
                return res.json({ success: false, message: "All fields are required." });
            }
            else if(first_name.trim().length < 3){
                return res.json({ success: false, message: "First name must be at least 3 characters." });
            }
            else if(last_name.trim().length < 3){
                return res.json({ success: false, message: "Last name must be at least 3 characters." });
            }
            else if(address.trim().length < 5){
                return res.json({ success: false, message: "Address must be at least 5 characters." });
            }
            else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                return res.json({ success: false, message: "Invalid email format." });
            }
            else if(password.trim().length < 8){
                return res.json({ success: false, message: "Password must be at least 8 characters." });
            }
            else if(password !== confirm_password){
                return res.json({ success: false, message: "Passwords do not match." });
            }
            else{
                const email_exist = await getEmployeeEmail(email);
    
                if(email_exist){
                    return res.json({ success: false, message: "Email already exists." });
                }
                else{
                    const hash_password = await bcrypt.hash(password, 12);
    
                    const new_user = await createUser({
                        first_name,
                        last_name,
                        address,
                        gender,
                        email,
                        password: hash_password,
                    });
    
                    if(new_user){
                        return res.json({ success: true, message: "Registration successful." });
                    }
                    else{
                        return res.json({ success: false, message: "Registration failed." });
                    }
                }
            }
        }
        catch(error){
            console.error(error);
            return res.json({ success: false, message: "Server error.", error: error.message || error });
        }
    }
    
    
    static async userLogin(req, res) {
        try{
            const { email, password } = req.body;

            if(!email || !password){
                res.json({ success: false, message: "Email and password are required." });
            }
            else{
                const user = getEmployeeEmail(email);

                if(!user){
                    res.json({ success: false, message: "Invalid email or password." });
                }
                else{
                    const match = await bcrypt.compare(password, user.password);

                    if(!match){
                        res.json({ success: false, message: "Invalid email or password." });
                    }
                    else{
                        req.session.user = {
                            employee_id: user.employee_id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            gender: user.gender
                        };
                        res.json({
                            success: true,
                            message: "Successfully logged in!",
                            user: req.session.user
                        });
                    }
                }
            }
        }
        catch(error){
            res.json({
                success: false,
                message: "Server error during login.",
                error: error.message || error
            });
        }
    }

    static async logout(req, res) {
        try{
            if(!req.session.user){
                res.json({ success: false, message: "No employee session found." });
            }
            else{
                req.session.destroy(error => {
                    if(error){
                        res.json({ success: false, message: "Logout failed." });
                    }
                    else{
                        res.json({ success: true, message: "Successfully logged out." });
                    }
                });
            }
        }
        catch(error){
            res.json({
                success: false,
                message: "Server error during logout.",
                error: error.message
            });
        }
    }
}

export default EmployeeControllers;
