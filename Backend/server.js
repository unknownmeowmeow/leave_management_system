import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import EmployeeRoutes from "./Routes/EmployeeRoutes.js";
import RoleRoutes from "./Routes/RoleRoutes.js";
import {MY_SECRET_SERVER_SESSION, EXPRESS_URL, FRONT_END_URL, CORS, SERVER_CONSOLE_LOG} from "./Constant.js";

const app = express();

app.use(cors(CORS));
app.use(express.json(FRONT_END_URL));
app.use(express.urlencoded(EXPRESS_URL));
app.use(session(MY_SECRET_SERVER_SESSION));

app.use("/api/auth", EmployeeRoutes); 
app.use("/api", RoleRoutes);         

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.listen(5000, () => SERVER_CONSOLE_LOG);
