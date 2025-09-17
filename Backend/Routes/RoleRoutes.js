import express from "express";
import RoleController from "../Controllers/RoleControllers.js";

const router = express.Router();

router.get("/roles", RoleController.getRoles);

export default router;
