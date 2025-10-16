import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddCredit() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState(null);

    const [formData, setFormData] = useState({
        employee_id: "",
        leave_type_id: "",
        earned_credit: ""
    });

    // Fetch leave types and employees
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leaveRes, empRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/leave_types/leave_type_rewarded", { withCredentials: true }),
                    axios.get("http://localhost:5000/api/auth/employeesbyrole", { withCredentials: true })
                ]);

                // Leave Types
                if (leaveRes.data.status && Array.isArray(leaveRes.data.result)) {
                    setLeaveTypes(leaveRes.data.result);
                } else {
                    setLeaveTypes([]);
                    setServerMessage("Failed to load leave types.");
                }

                // Employees
                if (empRes.data.status && Array.isArray(empRes.data.result)) {
                    setEmployees(empRes.data.result);
                } else {
                    setEmployees([]);
                    setServerMessage("Failed to load employee data.");
                }

            } catch (error) {
                setLeaveTypes([]);
                setEmployees([]);
                setServerMessage("Failed to load data from server.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage(null);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/credits/apply",
                formData,
                { withCredentials: true }
            );

            const data = response.data;

            // Use 'result' from backend instead of 'message'
            setServerMessage(data.result);

            // Reset form if successful
            if (data.status) {
                setFormData({
                    employee_id: "",
                    leave_type_id: "",
                    earned_credit: ""
                });
            }
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || "Server error occurred.";
            setServerMessage(msg);
        }
    };

    return (
        <div style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Segoe UI, Arial, sans-serif" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1>Admin - Add Leave Credit</h1>
                <div>
                    <a href="/" style={linkStyle}>Logout</a>
                    <a href="/employeecredit" style={linkStyle}>Employee Credit</a>
                    <a href="/adminleavefile" style={linkStyle}>Leave File Application</a>
                    <a href="/adminrecordfile" style={linkStyle}>Employee Leave Record</a>
                    <a href="/adminleavetypehistoryperemployee" style={linkStyle}>Employee Leave Credit</a>
                    <a href="/allhistoryemployeeleavecredit" style={linkStyle}>Leave Employee History</a>
                    <a href="/adminrewardedfile" style={linkStyle}>Leave Rewarded Employee History</a>                     
                    <a href="/admin" style={linkStyle}>Employee Attendance</a>
                </div>
            </div>

            <div style={formWrapperStyle}>
                <h2 style={formHeaderStyle}>Add Leave Credit</h2>

                {loading && <div>Loading data...</div>}

                {serverMessage && <div style={messageBoxStyle}>{serverMessage}</div>}

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
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.first_name} {emp.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Leave Type:</label>
                            <select
                                name="leave_type_id"
                                value={formData.leave_type_id}
                                onChange={handleChange}
                                style={selectStyle}
                            >
                                <option value="">Select Leave Type</option>
                                {leaveTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Earned Credit:</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="earned_credit"
                                value={formData.earned_credit}
                                onChange={handleChange}
                                placeholder="Enter credit amount"
                                style={inputStyle}
                            />
                        </div>

                        <button type="submit" style={submitButtonStyle}>Add Credit</button>
                    </form>
                )}
            </div>
        </div>
    );
}

// Styles
const linkStyle = { textDecoration: "none", color: "#007bff", fontSize: "16px", margin: "0 10px" };
const formWrapperStyle = { backgroundColor: "#f9f9f9", padding: "30px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" };
const formHeaderStyle = { marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" };
const messageBoxStyle = { marginBottom: "20px", padding: "10px", borderRadius: "4px", backgroundColor: "#f0f0f0", color: "#333", fontWeight: "bold" };
const inputGroupStyle = { marginBottom: "20px" };
const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "5px" };
const inputStyle = { width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px" };
const selectStyle = { ...inputStyle };
const submitButtonStyle = { padding: "12px 24px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer" };
