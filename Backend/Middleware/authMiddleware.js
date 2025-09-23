import { SESSION_USER_NOT_FOUND } from "../constant.js";

class AuthMiddleware{

    static requireLogin(req, res, next){
        
        if(!req.session || !req.session.user){
            return res.json(SESSION_USER_NOT_FOUND);
        }

        next(); 
    }
}
export default AuthMiddleware;
