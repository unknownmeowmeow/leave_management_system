import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [records, setRecords] = useState([]);

    const headerContainerStyle = {
        textAlign: "center",
        marginTop: "50px",
    };

    const linkStyle = {
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
                if (response.data.success) {
                    setRecords(response.data.records);
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
        <div style={headerContainerStyle}>
            <h1>Welcome Admin</h1>
            <a href="/" style={linkStyle}>Logout</a>
            <a href="/employeecredit" style={linkStyle}>Employee Credit</a>
            <a href="/" style={linkStyle}>Leave File Application</a>
            <a href="/admin" style={linkStyle}>Employee Attendance</a>
            <a href="/admin" style={linkStyle}>Employee Leave Record</a>

            <h2 style={{ marginTop: "40px" }}>Employee Attendance Records</h2>
            <table
                style={{
                    margin: "0 auto",
                    borderCollapse: "collapse",
                    width: "80%",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#e0e0e0" }}>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Full Name</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Time In</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Time Out</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                                No records found.
                            </td>
                        </tr>
                    )}

                    {records.length > 0 && records.map((record, index) => {
                        const fullName = record.first_name + " " + record.last_name;

                        let timeInDisplay = "N/A";
                        let timeOutDisplay = "N/A";
                        let dateDisplay = "N/A";

                        if (record.time_in) {
                            const timeInDate = new Date(record.time_in);
                            timeInDisplay = timeInDate.toLocaleTimeString();
                            dateDisplay = timeInDate.toLocaleDateString();
                        }

                        if (record.time_out) {
                            timeOutDisplay = new Date(record.time_out).toLocaleTimeString();
                        }

                        return (
                            <tr key={index}>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {fullName}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {dateDisplay}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {timeInDisplay}
                                </td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {timeOutDisplay}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
