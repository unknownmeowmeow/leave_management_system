import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
<<<<<<< HEAD
import employee from "./Routes/employee_routes.js";
import time from "./Routes/attendace_routes.js";
import { MY_SECRET_SERVER_SESSION } from "./Constant/constants.js";
import leave_type from "./Routes/leave_file_routes.js";
import "./Scheduler/yearly_add_credit_helper.js";
import credit from "./Routes/leave_credit_routes.js";
import leave_file from "./Routes/leave_file_routes.js";
import leave_transaction from "./Routes/leave_transaction_routes.js";
=======

import employeeRoutes from "./routes/employee.js";
import attendanceRoutes from "./routes/time.js";
import adminRoutes from "./routes/admin.js";
import leaveRoutes from "./routes/leave_file.js";
import creditRoutes from "./routes/leave_credit.js";
import leaveTypeRoutes from "./routes/leave_file.js";
import { MY_SECRET_SERVER_SESSION } from "./constant/constants.js";
import "./scheduler/yearly_add_credit_helper.js";

>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: MY_SECRET_SERVER_SESSION,
    resave: false,
    saveUninitialized: false
}));

<<<<<<< HEAD
app.use("/api/credits", credit);
app.use("/api/auth", employee); 
app.use("/api/attendance", time);
app.use("/api/leave_types", leave_type);
app.use("/api", leave_file);
app.use("/api/transaction", leave_transaction);
=======
app.use("/api/auth", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/", leaveTypeRoutes);
app.use("/api/credit", creditRoutes);


>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.listen(5000, () => console.log(" Server running on http://localhost:5000"));
