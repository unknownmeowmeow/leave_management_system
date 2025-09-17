import RoleModel from "../Models/RoleModel.js";

class RoleController {

    static async getRoles(req, res) {

        try {
            const response_data = await RoleModel.getAllRoles();

            if (response_data.error) {
                return res.status(500).json({
                    success: false,
                    message: response_data.error
                });
            }

            res.json({
                success: true,
                roles: response_data.result
            });
        } 
        catch (err) {
            console.error("Error fetching roles:", err);
            res.status(500).json({
                success: false,
                message: "Failed to fetch roles"
            });
        }
    }
}

export default RoleController;
