class AuthEmployee{
    /**
     * Middleware to require user login by checking session.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} next - The next middleware function.
     * Last Updated At: September 19, 2025 4:35 PM
     * @author Keith
     */
    requireLogin(req, res, next){

        if(!req.session || !req.session.user){
            return res.json({ status: false, result: "User session not found." });
        }
        
        req.user = req.session.user;                 
        req.employee_id = req.session.user.employee_id;
        next();
    }
}

<<<<<<< HEAD:Backend/Middleware/authMiddleware.js
export default new AuthMiddleware();
=======
export default AuthEmployee;
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06:Backend/middleware/auth.js
