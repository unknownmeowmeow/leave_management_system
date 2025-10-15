/**
 * Retrieves the user object from the session.
 * Throws an error if the session or user data is missing.
 * @param {Object} req - Express request object containing session.
 * @returns {Object} User object stored in the session.
 * @throws Will throw an error if the user session is not found.
 * Last Updated At: October 12, 2025
 * @author Keith
 */
export function getUserFromSession(req){
    if(!req || !req.session || !req.session.user){
        throw new Error("User session not found");
    }

    return req.session.user;
}
