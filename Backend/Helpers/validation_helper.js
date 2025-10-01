
class ValidationHelper{

    /**
     * Validates employee registration input fields for correctness and compliance.
     *
     * Workflow:
     * 1. **Required Fields**
     *    - Ensures `first_name`, `last_name`, `email`, `password`, `confirm_password`, `role`, and `gender` are all provided.
     *    - Returns: `["All fields are required."]` if any are missing.
     *
     * 2. **Name Validation**
     *    - `first_name` and `last_name` must contain only letters and spaces (`/^[a-zA-Z\s]+$/`).
     *    - Must be at least **3 characters long**.
     *
     * 3. **Email Validation**
     *    - Checks if email matches standard format (`example@gmail.com`).
     *
     * 4. **Password Validation**
     *    - Must be at least **8 characters long**.
     *    - Must match `confirm_password`.
     *
     * 5. **Return Value**
     *    - Returns an array of error messages:
     *      - `[]` → No errors (valid input).
     *      - `["<error message>"]` → One or more validation errors.
     *    - In case of unexpected error → `["Error in validation registrations."]`.
     *
     * Example Success:
     * []
     *
     * Example Failure:
     * ["Password must be at least 8 characters."]
     *
     * @param {Object} employee_data - Employee registration data.
     * @param {string} employee_data.first_name - Employee's first name.
     * @param {string} employee_data.last_name - Employee's last name.
     * @param {string} employee_data.email - Employee's email address.
     * @param {string} employee_data.password - Password chosen by employee.
     * @param {string} employee_data.confirm_password - Confirmation of password.
     * @param {string|number} employee_data.role - Role assigned to employee.
     * @param {string} employee_data.gender - Gender of employee.
     *
     * @returns {Array<string>} List of error messages. Empty if all validations pass.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:05 PM
     */
    static validateEmployeeRegistration(employee_data){

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
     *
     * Workflow:
     * 1. **Required Fields**
     *    - Ensures `email` and `password` are provided.
     *    - If missing → returns: `["All fields are required."]`.
     *
     * 2. **Email Format Validation**
     *    - Validates `email` against standard email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
     *    - If invalid → returns: `["Please enter a valid email address."]`.
     *
     * 3. **Return Value**
     *    - Returns an array of error messages:
     *      - `[]` → No errors (valid input).
     *      - `["<error message>"]` → One or more validation errors.
     *    - On unexpected error → returns `["Error in validation login."]`.
     *
     * Example Success:
     * []
     *
     * Example Failure:
     * ["Please enter a valid email address."]
     *
     * @param {Object} employee_data - Employee login data.
     * @param {string} employee_data.email - Employee's login email.
     * @param {string} employee_data.password - Employee's login password.
     *
     * @returns {Array<string>} List of error messages. Empty if all validations pass.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:15 PM
     */
    static validateEmployeeLogin(employee_data){

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
     *
     * Workflow:
     * 1. **Required Fields**
     *    - Ensures `leave_type`, `start_date`, and `end_date` are provided.
     *    - If any are missing → returns: `["All fields are required."]`.
     *
     * 2. **Return Value**
     *    - Returns an array of error messages:
     *      - `[]` → No errors (valid input).
     *      - `["<error message>"]` → One or more validation errors.
     *    - On unexpected error → returns `["Error in validating leave application."]`.
     *
     * Example Success:
     * []
     *
     * Example Failure:
     * ["All fields are required."]
     *
     * @param {Object} leave_data - Leave application data.
     * @param {string|number} leave_data.leave_type - Selected leave type.
     * @param {string} leave_data.start_date - Leave start date (YYYY-MM-DD).
     * @param {string} leave_data.end_date - Leave end date (YYYY-MM-DD).
     *
     * @returns {Array<string>} List of error messages. Empty if all validations pass.
     *
     * created by: Rogendher Keith Lachica
     * updated at: October 1, 2025 02:25 PM
     */
     static validateLeaveApplication(leave_data) {
        try{
            const { leave_type, start_date, end_date } = leave_data;

            if(!leave_type || !start_date || !end_date){
                return ["All fields are required."];
            }

            return []; 
        } 
        catch(error) {
            return ["Error in validating leave application."];
        }
    }
}

export default ValidationHelper;
