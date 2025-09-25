import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveFile() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
    });
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/leave_types_admin", {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setLeaveTypes(res.data.data);
                    setError(null);
                } else {
                    setError(res.data.message || "Unable to load leave types.");
                    setLeaveTypes([]);
                }
            } catch {
                setError("Error fetching leave types.");
                setLeaveTypes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveTypes();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
            setSubmitStatus({ success: false, message: "Please fill out all fields." });
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/submit_leave", formData, {
                withCredentials: true,
            });

            if (response.data.success) {
                setSubmitStatus({ success: true, message: "Leave application submitted successfully!" });
                setFormData({
                    leaveType: "",
                    startDate: "",
                    endDate: "",
                    reason: "",
                });
            } else {
                setSubmitStatus({ success: false, message: response.data.message || "Submission failed." });
            }
        } catch {
            setSubmitStatus({ success: false, message: "An error occurred during submission." });
        }
    };

    const link_style = {
        textDecoration: "none",
        color: "#007bff",
        fontSize: "16px",
        margin: "0 10px",
    };

    return (
        <div style={{ maxWidth: "700px", margin: "40px auto", fontFamily: "Segoe UI, Arial, sans-serif" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1>Welcome Admin</h1>
                <div>
                    <a href="/" style={link_style}>Logout</a>
                    <a href="/employeecredit" style={link_style}>Employee Credit</a>
                    <a href="/adminleavefile" style={link_style}>Leave File Application</a>
                    <a href="/adminrecordfile" style={link_style}>Employee Leave Record</a>
                    <a href="/admin" style={link_style}>Employee Attendance</a>
                </div>
            </div>

            <div style={{
                backgroundColor: "#f9f9f9",
                padding: "30px",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                    Leave Application Form
                </h2>

                {loading && <div>Loading leave types...</div>}
                {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
                {submitStatus && (
                    <div style={{ color: submitStatus.success ? "green" : "red", marginBottom: "15px" }}>
                        {submitStatus.message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            Leave Type:
                        </label>
                        <select
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                fontSize: "16px"
                            }}
                        >
                            <option value="">Select Leave Type</option>
                            {leaveTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            Start Date:
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                fontSize: "16px"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            End Date:
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                fontSize: "16px"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "25px" }}>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            Reason:
                        </label>
                        <input
                            type="text"
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Enter your reason"
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                fontSize: "16px"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "16px",
                            cursor: "pointer",
                            transition: "background-color 0.3s ease"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
