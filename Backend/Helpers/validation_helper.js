
class ValidationHelper{

    /**
     * Validates employee registration input fields for correctness and compliance.
     * @param {Object} employee_data - Employee registration data.
     * @param {string} employee_data.first_name - Employee's first name.
     * @param {string} employee_data.last_name - Employee's last name.
     * @param {string} employee_data.email - Employee's email address.
     * @param {string} employee_data.password - Password chosen by employee.
     * @param {string} employee_data.confirm_password - Confirmation of password.
     * @param {string|number} employee_data.role - Role assigned to employee.
     * @param {string} employee_data.gender - Gender of employee.
     * @returns {Array<string>} List of error messages. Empty if all validations pass.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    validateEmployeeRegistration(employee_data){

        try{
            const { first_name, last_name, email, password, confirm_password, role, gender } = employee_data;

            if(!first_name || !last_name || !email || !password || !confirm_password || !role || !gender){
                return ["All fields are required."];
            }
            
            const first_name_validation = first_name.trim();
            const last_name_validation = last_name.trim();
            const email_validation = email.trim().toLowerCase();
            const password_validation = password.trim();
            const confirm_password_validation = confirm_password.trim();

            if(!/^[a-zA-Z\s]+$/.test(first_name_validation)){
                return ["First name must contain only letters and spaces."];
            }

            if(first_name_validation.length < 3){
                return ["First name must be at least 3 letters."];
            }

            if(!/^[a-zA-Z\s]+$/.test(last_name_validation)) {
                return ["Last name must contain only letters and spaces."];
            }

            if(last_name_validation.length < 3){
                return ["Last name must be at least 3 letters."];
            }

            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_validation)){
                return ["Please enter a valid email address."];
            }

            if(password_validation.length < 8){
                return ["Password must be at least 8 characters."];
            }

            if(password_validation !== confirm_password_validation){
                return ["Password and confirm password do not match."];
            }

            return [];
        }
        catch(error){
            return ["Error in validation registrations."];
        }
    }

    /**
     * Validates employee login input fields for correctness.
     * @param {Object} employee_data - Employee login data.
     * @param {string} employee_data.email - Employee's login email.
     * @param {string} employee_data.password - Employee's login password.
     * @returns {Array<string>} List of error messages. Empty if all validations pass.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    validateEmployeeLogin(employee_data){

        try{
            const { email, password } = employee_data;

            if(!email || !password){
                return ["All fields are required."];
            }
            else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                return ["Please enter a valid email address."];
            }

            return [];
        }
        catch(error){
            return ["Error in validation login."];
        }
    }
    
    /**
     * Validates leave application input fields for completeness.
     * @param {Object} leave_data - Leave application data.
     * @param {string|number} leave_data.leave_type - Selected leave type.
     * @param {string} leave_data.start_date - Leave start date (YYYY-MM-DD).
     * @param {string} leave_data.end_date - Leave end date (YYYY-MM-DD).
     * @returns {Array<string>} List of error messages. Empty if all validations pass.
     * Last Updated At: October 1, 2025
     * @author Keith
     */
    validateLeaveApplication(leave_data){

        try{
            const { leave_type, start_date, end_date } = leave_data;

            if(!leave_type || !start_date || !end_date){
                return ["All fields are required."];
            }

            return []; 
        } 
        catch(error){
            return ["Error in validating leave application."];
        }
    }
}

export default new ValidationHelper();
