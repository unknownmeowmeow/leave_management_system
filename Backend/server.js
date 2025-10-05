import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import employee from "./routes/employee_routes.js";
import attendance from "./routes/time_routes.js";
import admin from "./routes/admin_routes.js";
import { MY_SECRET_SERVER_SESSION } from "./constant/constants.js";
import leave from "./routes/leave_file.js";
import "./scheduler/yearly_add_credit_helper.js";
import credit from "./routes/leave_credit_routes.js";
import leave_file from "./routes/leave_file.js";
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: MY_SECRET_SERVER_SESSION, resave: false, saveUninitialized: false }));

app.use("/api/admin", admin);
app.use("/api/auth", employee); 
app.use("/api/attendance", attendance)    
app.use("/", leave);
app.use("/api/leave", admin);
app.use("/api", credit);
app.use("/api", leave_file);
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.listen(5000);
