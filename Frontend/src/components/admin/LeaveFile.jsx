import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveFile() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState(null);

    const [formData, setFormData] = useState({
        employee_id: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const leaveRes = await axios.get("http://localhost:5000/api/leave_types_admin", {
                    withCredentials: true,
                });
                if (leaveRes.data.success) setLeaveTypes(leaveRes.data.data);

                const empRes = await axios.get("http://localhost:5000/api/employeesbyrole", {
                    withCredentials: true,
                });
                if (empRes.data.status) setEmployees(empRes.data.result);
            } catch (error) {
                setServerMessage("Failed to load data from server.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage(null);

        try {
            const response = await axios.post("http://localhost:5000/api/apply", formData, {
                withCredentials: true,
            });

            let msg = "";
            if (typeof response.data.message === "string") {
                msg = response.data.message;
            } 
            else if(typeof response.data.message === "object" && response.data.message !== null) {
                msg = response.data.message.message || JSON.stringify(response.data.message);
            } 
            else {
                msg = "Unknown response from server.";
            }

            setServerMessage(msg);

            if (response.data.success) {
                setFormData({
                    employee_id: "",
                    leave_type: "",
                    start_date: "",
                    end_date: "",
                    reason: "",
                });
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "Server error occurred.";
            setServerMessage(msg);
        }
    };

    return (
        <div style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Segoe UI, Arial, sans-serif" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1>Welcome Admin</h1>
                <div>
                    <a href="/" style={linkStyle}>Logout</a>
                    <a href="/employeecredit" style={linkStyle}>Employee Credit</a>
                    <a href="/adminleavefile" style={linkStyle}>Leave File Application</a>
                    <a href="/adminrecordfile" style={linkStyle}>Employee Leave Record</a>
                    <a href="/admin" style={linkStyle}>Employee Attendance</a>
                </div>
            </div>

            <div style={formWrapperStyle}>
                <h2 style={formHeaderStyle}>Leave Application Form</h2>

                {loading && <div>Loading data...</div>}

                {serverMessage && typeof serverMessage === "string" && (
                    <div style={messageBoxStyle}>{serverMessage}</div>
                )}

                {!loading && (
                    <form onSubmit={handleSubmit}>
                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Employee:</label>
                            <select
                                name="employee_id"
                                value={formData.employee_id}
                                onChange={handleChange}
                                style={selectStyle}
                            >
                                <option value="">Select Employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.first_name} {emp.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Leave Type:</label>
                            <select
                                name="leave_type"
                                value={formData.leave_type}
                                onChange={handleChange}
                                style={selectStyle}
                            >
                                <option value="">Select Leave Type</option>
                                {leaveTypes.map((type) => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Start Date:</label>
                            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} style={inputStyle} />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>End Date:</label>
                            <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} style={inputStyle} />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Reason:</label>
                            <input type="text" name="reason" value={formData.reason} onChange={handleChange} placeholder="Enter your reason" style={inputStyle} />
                        </div>

                        <button type="submit" style={submitButtonStyle}>Submit</button>
                    </form>
                )}
            </div>
        </div>
    );
}

const linkStyle = { textDecoration: "none", color: "#007bff", fontSize: "16px", margin: "0 10px" };
const formWrapperStyle = { backgroundColor: "#f9f9f9", padding: "30px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" };
const formHeaderStyle = { marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" };
const messageBoxStyle = { marginBottom: "20px", padding: "10px", borderRadius: "4px", backgroundColor: "#f0f0f0", color: "#333", fontWeight: "bold" };
const inputGroupStyle = { marginBottom: "20px" };
const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "5px" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px" };
const selectStyle = { ...inputStyle };
const submitButtonStyle = { padding: "12px 24px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer" };
