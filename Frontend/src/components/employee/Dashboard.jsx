import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [records, setRecords] = useState([]);

    // Fetch attendance records on component mount
    const fetchRecords = async () => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/attendance/record",
                {},
                { withCredentials: true }
            );
            if (res.data.status) {
                setRecords(res.data.result);
            } else {
                alert(res.data.result || "No attendance records found.");
            }
        } catch (err) {
            alert(err.response?.data?.result || "Failed to fetch records.");
        }
    };

    useEffect(() => {
<<<<<<< HEAD
        fetchRecords();
    }, []);

    const containerStyle = {
        maxWidth: "900px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fafafa",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    };
=======
        axios.post("http://localhost:5000/api/attendance/record", {}, { withCredentials: true })
            .then(res => {
                if (res.data.success) {
                    setRecords(res.data.records ?? []);
                } else {
                    setRecords([]);
                }
            })
            .catch(err => {
                alert(err.response?.data?.message || "Failed to fetch records.");
                setRecords([]); 
            });
    }, []);
    
    const containerStyle = { maxWidth: "900px", margin: "50px auto", padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#fafafa", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
    const navLinkStyle = { marginRight: "15px", textDecoration: "none", color: "#007bff", fontWeight: 500 };
    const cellStyle = { padding: "12px", border: "1px solid #ccc", textAlign: "center" };
    const headerStyle = { ...cellStyle, backgroundColor: "#f0f0f0" };
    const buttonStyle = { padding: "10px 20px", margin: "0 10px", cursor: "pointer" };

    const handleAction = async (url) => {
    
        try {
            const res = await axios.post(url, {}, { withCredentials: true });
<<<<<<< HEAD

            if (res.data.status) {
                alert(res.data.result); // Success message
            } else {
                alert(res.data.result || "Action failed."); // Backend error message
            }

            // Refresh attendance records after Time IN/OUT
            if (url.includes("timein") || url.includes("timeout")) {
                fetchRecords();
            }
        } catch (err) {
            alert(err.response?.data?.result || "Action failed.");
=======
            console.log("✅ Response:", res);
            alert(res.data.message);
        } catch (err) {
            console.error("❌ Error object:", err);
            alert(err.response?.data?.message || "Action failed.");
>>>>>>> e32ee9aad433961e2090e70aa930345a3b923f06
        }
    };
    
    

    return (
        <div style={containerStyle}>
            {/* Navigation */}
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <a href="/application" style={navLinkStyle}>Leave File</a>
                <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
                <a href="/recordfile" style={navLinkStyle}>RecordFile</a>
                <a href="/leavetypecredit" style={navLinkStyle}>Leave Credit Balances</a>
                <a href="/" style={navLinkStyle}>Logout</a>
            </div>

            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome Employee</h1>

            {/* Action Buttons */}
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
                <button style={buttonStyle} onClick={() => handleAction("http://localhost:5000/api/attendance/timein")}>
                    Time IN
                </button>
                <button style={buttonStyle} onClick={() => handleAction("http://localhost:5000/api/attendance/timeout")}>
                    Time OUT
                </button>
            </div>

            <h2 style={{ marginBottom: "20px" }}>Your Attendance Records</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={headerStyle}>Date</th>
                        <th style={headerStyle}>Time In</th>
                        <th style={headerStyle}>Time Out</th>
                        <th style={headerStyle}>Working Hour</th>
                        <th style={headerStyle}>Credit</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={cellStyle}>No records found.</td>
                        </tr>
                    ) : (
                        records.map((record, i) => {
                            const dateDisplay = record.time_in ? new Date(record.time_in).toLocaleDateString() : "N/A";
                            const timeInDisplay = record.time_in ? new Date(record.time_in).toLocaleTimeString() : "N/A";
                            const timeOutDisplay = record.time_out ? new Date(record.time_out).toLocaleTimeString() : "N/A";
                            const workHour = record.work_hour ?? 0;

                            const workHourDisplay = `${Math.abs(workHour)} ${Math.abs(workHour) === 1 ? "hour" : "hours"}`;
                            const creditDisplay = workHour > 0
                                ? `Overtime (${workHourDisplay})`
                                : workHour < 0
                                    ? `Undertime (${workHourDisplay})`
                                    : "0 hours";

                            return (
                                <tr key={i} style={{ backgroundColor: i % 2 ? "#f9f9f9" : "transparent" }}>
                                    <td style={cellStyle}>{dateDisplay}</td>
                                    <td style={cellStyle}>{timeInDisplay}</td>
                                    <td style={cellStyle}>{timeOutDisplay}</td>
                                    <td style={cellStyle}>{workHourDisplay}</td>
                                    <td style={{ ...cellStyle, color: workHour > 0 ? "green" : workHour < 0 ? "red" : "black" }}>
                                        {creditDisplay}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
