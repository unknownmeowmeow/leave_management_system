import React from "react";

export default function RecordFile() {
  
    const container_style = {
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    };

    const heading_style = {
        textAlign: "center",
        marginBottom: "20px",
    };

    const table_styling = {
        width: "100%",
        borderCollapse: "collapse",
    };

    const table_header_thread = {
        border: "1px solid #ccc",
        padding: "12px",
        textAlign: "left",
    };

    const header_row = {
        backgroundColor: "#f0f0f0",
    };

    const link_style = {
        textDecoration: "none",
        color: "#007bff",
        fontSize: "16px",
        margin: "0 10px",
    };

    return (
        <div style={container_style}>
  
            <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px" }}>
                <h1>Welcome Admin</h1>
                <div>
                    <a href="/" style={link_style}>Logout</a>
                    <a href="/employeecredit" style={link_style}>Employee Credit</a>
                    <a href="/adminleavefile" style={link_style}>Leave File Application</a>
                    <a href="/adminrecordfile" style={link_style}>Employee Leave Record</a>
                    <a href="/admin" style={link_style}>Employee Attendance</a>
                </div>
            </div>

            <h2 style={heading_style}>Approved Leave Records</h2>
            <table style={table_styling}>
                <thead>
                    <tr style={header_row}>
                        <th style={table_header_thread}>Employee Name</th>
                        <th style={table_header_thread}>Leave Type</th>
                        <th style={table_header_thread}>Start Date</th>
                        <th style={table_header_thread}>End Date</th>
                        <th style={table_header_thread}>Reason</th>
                        <th style={table_header_thread}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="6" style={{ ...table_header_thread, textAlign: "center" }}>
                            No approved leaves found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
