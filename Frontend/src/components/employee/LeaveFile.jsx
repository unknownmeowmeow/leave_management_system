import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeeApply() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveCredit, setLeaveCredit] = useState(0);
    const [form, setForm] = useState({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resTypes, resCredit] = await Promise.all([
                    axios.get("http://localhost:5000/api/leave_types", { withCredentials: true }),
                    axios.get("http://localhost:5000/api/leave/latest_credit", { withCredentials: true }),
                ]);

                if (resTypes.data.success) setLeaveTypes(resTypes.data.data);
                if (resCredit.data.success) setLeaveCredit(resCredit.data.latest_credit);
            } catch (err) {
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/leave/apply",
                form,
                { withCredentials: true }
            );

            if (res.data.success) {
                setMessage(
                    typeof res.data.message === "string"
                        ? res.data.message
                        : JSON.stringify(res.data.message)
                );
                setForm({ leave_type: "", start_date: "", end_date: "", reason: "" });

                // Refresh leave credit after successful leave application
                const resCredit = await axios.get(
                    "http://localhost:5000/api/leave/latest_credit",
                    { withCredentials: true }
                );
                if (resCredit.data.success) setLeaveCredit(resCredit.data.latest_credit);
            } else {
                setError(
                    typeof res.data.message === "string"
                        ? res.data.message
                        : JSON.stringify(res.data.message)
                );
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server error.");
        }
    };

    // Styles
    const containerStyle = {
        maxWidth: "900px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fafafa",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    };
    const navLinkStyle = { marginRight: "15px", textDecoration: "none", color: "#007bff", fontWeight: 500 };
    const buttonStyle = { padding: "10px 20px", margin: "0 10px", cursor: "pointer" };
    const inputStyle = { width: "100%", padding: "8px", marginTop: "5px" };

    const selectedLeaveType = leaveTypes.find(
        (t) => t.id === Number(form.leave_type)
    );

    return (
        <div style={containerStyle}>
            {/* Navigation */}
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <a href="/application" style={navLinkStyle}>Leave File</a>
                <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
                <a href="/recordfile" style={navLinkStyle}>RecordFile</a>
                <a href="/" style={navLinkStyle}>Logout</a>
            </div>

            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome Employee</h1>

            {error && <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>}
            {message && <div style={{ color: "green", marginBottom: "15px" }}>{message}</div>}

            {/* Display leave credit */}
            <div style={{ marginBottom: "15px", color: "blue", fontWeight: "bold" }}>
                Available Leave Credit: {leaveCredit} days
            </div>

            <h2 style={{ marginBottom: "20px" }}>Leave Application Form</h2>
            <form onSubmit={handleSubmit}>
                <label style={{ display: "block", marginBottom: "10px" }}>
                    Leave Type:
                    <select
                        name="leave_type"
                        value={form.leave_type}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map(
                            (t) => t && t.name && <option key={t.id} value={t.id}>{t.name}</option>
                        )}
                    </select>
                </label>

                <label style={{ display: "block", marginBottom: "10px" }}>
                    Start Date:
                    <input
                        type="date"
                        name="start_date"
                        value={form.start_date}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </label>

                <label style={{ display: "block", marginBottom: "10px" }}>
                    End Date:
                    <input
                        type="date"
                        name="end_date"
                        value={form.end_date}
                        onChange={handleChange}
                        style={inputStyle}
                    />
                </label>

                <label style={{ display: "block", marginBottom: "20px" }}>
                    Reason:
                    <input
                        type="text"
                        name="reason"
                        value={form.reason}
                        onChange={handleChange}
                        placeholder="Enter your reason"
                        style={inputStyle}
                    />
                </label>

                <button
                    type="submit"
                    style={{ ...buttonStyle, backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
