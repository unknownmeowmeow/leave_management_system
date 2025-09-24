import { SESSION_USER_NOT_FOUND  } from "../Constant/Constants.js";

class AuthMiddleware {
    /**
     * Middleware to require user login by checking session.
     * @param {object} req - The request object.
     * @param {object} res - The response object.
     * @param {function} next - The next middleware function.
     * created by: rogendher keith lachica
     * updated at: September 19 2025 4:35pm
     */
    static requireLogin(req, res, next) {
        
        if (!req.session || !req.session.user) {
            return res.json(SESSION_USER_NOT_FOUND);
        }

        next();
    }
}

export default AuthMiddleware;
