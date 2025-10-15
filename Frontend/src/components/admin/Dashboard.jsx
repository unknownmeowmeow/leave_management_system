import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [records, setRecords] = useState([]);

    const link_style = {
        textDecoration: "none",
        color: "#007bff",
        fontSize: "16px",
        margin: "0 10px",
    };

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:5000/api/attendance/records",
                    {},
                    { withCredentials: true }
                );
    
                if (response.data.status) {
                
                    setRecords(response.data.result || []);
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert(error.response?.data?.message || "Failed to fetch records");
            }
        };
    
        fetchRecords();
    }, []);
    


    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px" }}>
                <h1>Welcome Admin</h1>

                <div>
                    <a href="/" style={link_style}>Logout</a>
                    <a href="/employeecredit" style={link_style}>Employee Credit</a>
                    <a href="/adminleavefile" style={link_style}>Leave File Application</a>
                    <a href="/adminrecordfile" style={link_style}>Employee Leave Record</a>
                    <a href="/adminleavetypehistoryperemployee" style={link_style}>Employee Leave History</a>
                    <a href="/adminrewardedfile" style={link_style}>Leave Rewarded Employee History</a>                     
                    <a href="/admin" style={link_style}>Employee Attendance</a>
                </div>
            </div>

            <h2 style={{ marginTop: "40px" }}>Employee Attendance Records</h2>
            <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}>
                <thead>
                    <tr style={{ backgroundColor: "#e0e0e0" }}>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Full Name</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Time In</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Time Out</th>
                    </tr>
                </thead>
                <tbody>
                    {(records || []).length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        (records || []).map((record, index) => {
                            const fullName = `${record.first_name} ${record.last_name}`;
                            const timeIn = record.time_in ? new Date(record.time_in).toLocaleTimeString() : "N/A";
                            const timeOut = record.time_out ? new Date(record.time_out).toLocaleTimeString() : "N/A";
                            const date = record.time_in ? new Date(record.time_in).toLocaleDateString() : "N/A";

                            return (
                                <tr key={index}>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{fullName}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{date}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{timeIn}</td>
                                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{timeOut}</td>
                                </tr>
                            );
                        })
                    )}

                </tbody>
            </table>
        </div>
    );
}
