import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaveTypeCredit() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serverMessage, setServerMessage] = useState(null);

    useEffect(() => {
        const fetchAllHistory = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/credits/all/history", { withCredentials: true });
                if (res.data.status && Array.isArray(res.data.result)) {
                    setHistory(res.data.result);
                    setServerMessage(null);
                } else {
                    setHistory([]);
                    setServerMessage(res.data.message || "No history found");
                }
            } catch (err) {
                setHistory([]);
                setServerMessage(err.response?.data?.message || "Server error");
            } finally {
                setLoading(false);
            }
        };
        fetchAllHistory();
    }, []);

    // Styles
    const linkStyle = { textDecoration: "none", color: "#007bff", fontSize: "16px", margin: "0 10px" };
    const wrapperStyle = { backgroundColor: "#f9f9f9", padding: "30px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", fontFamily: "Segoe UI, Arial, sans-serif" };
    const headerStyle = { marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" };
    const messageBoxStyle = { marginBottom: "20px", padding: "10px", borderRadius: "4px", backgroundColor: "#f0f0f0", color: "#333", fontWeight: "bold" };
    const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
    const thTdStyle = { border: "1px solid #ccc", padding: "8px", textAlign: "center" };

    return (
        <div style={{ maxWidth: "1200px", margin: "50px auto" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1>Admin - Employee Leave History</h1>
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

            <div style={wrapperStyle}>
                <h2 style={headerStyle}>All Employee Leave Credit History</h2>

                {serverMessage && <div style={messageBoxStyle}>{serverMessage}</div>}

                {loading ? (
                    <div>Loading history...</div>
                ) : history.length === 0 ? (
                    <div>No leave history available.</div>
                ) : (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Employee</th>
                                <th style={thTdStyle}>Earned</th>
                                <th style={thTdStyle}>Used</th>
                                <th style={thTdStyle}>Deducted</th>
                                <th style={thTdStyle}>Latest Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(history || []).map((h, index) => (
                                <tr key={index}>
                                    <td style={thTdStyle}>{h.first_name} {h.last_name}</td>
                                    <td style={thTdStyle}>{h.total_earned_credit}</td>
                                    <td style={thTdStyle}>{h.total_used_credit}</td>
                                    <td style={thTdStyle}>{h.total_deducted_credit}</td>
                                    <td style={thTdStyle}>{h.total_latest_credit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
