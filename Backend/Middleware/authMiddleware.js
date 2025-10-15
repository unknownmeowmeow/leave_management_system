class AuthMiddleware{
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
        next();
    }
}

export default new AuthMiddleware();
