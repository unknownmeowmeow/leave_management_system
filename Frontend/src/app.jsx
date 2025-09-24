import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import Dashboard from "./components/employee/Dashboard.jsx";
import AdminDashboard from "./components/admin/Dashboard.jsx";
import LeaveFile from "./components/employee/LeaveFile.jsx";
import RecordFile from "./components/employee/RecordFile.jsx";
import AdminRecordLeave from "./components/admin/RecordLeave.jsx";
import NotFound from "./components/NotFound.jsx";
import Footers from "./components/partial/Footer.jsx";
import Logout from "./components/auth/Login.jsx";
import InternDashboard from "./components/intern/Dashboard.jsx";
import Credit from "./components/admin/CreditEmployee.jsx";
import AdminLeaveFileApplication from "./components/admin/LeaveFile.jsx";
import AdminRecordFile from "./components/admin/RecordLeave.jsx";
function App() {
  const main_content_style = { padding: "20px", minHeight: "80vh" };

  return (

    <Router>

      <div style={main_content_style}>
        <Routes>
          <Route path="/employeecredit" element={<Credit />} />
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/application" element={<LeaveFile />} />
          <Route path="/recordfile" element={<RecordFile />} />
          <Route path="/adminrecordfile" element={<AdminRecordFile />} />
          <Route path="/adminleavefile" element={<AdminLeaveFileApplication />} />
          <Route path="/recordleave" element={<AdminRecordLeave />} />
          <Route path="/interndashboard" element={<InternDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      <Footers />
      
    </Router>
    
  );
}

export default App;
