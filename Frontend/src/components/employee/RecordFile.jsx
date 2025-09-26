import React from "react";

export default function RecordFile() {
    const container_style = {
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    };

    const header_container_style = {
        textAlign: "center",
        marginTop: "30px",
        marginBottom: "30px",
    };

    const button_style = {
        padding: "10px 20px",
        fontSize: "16px",
        margin: "0 10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#f0f0f0",
        transition: "background-color 0.3s",
    };

    const link_style = {
        textDecoration: "none",
        color: "#007bff",
        fontSize: "16px",
        margin: "0 10px",
    };

    const heading_style = {
        textAlign: "center",
        marginBottom: "20px",
    };

    const table_style = {
        width: "100%",
        borderCollapse: "collapse",
    };

    const table_header_style = {
        border: "1px solid #ccc",
        padding: "12px",
        textAlign: "left",
    };

    const header_row_style = {
        backgroundColor: "#f0f0f0",
    };

    return (
        <div style={container_style}>
            {/* Header / Navigation Section */}
            <div style={header_container_style}>
                <h1>Welcome Employee</h1>
                <div style={{ marginBottom: "20px" }}>
                    <button style={button_style}>Time IN</button>
                    <button style={button_style}>Time OUT</button>
                </div>
                <div>
                    <a href="/application" style={link_style}>
                        Leave File
                    </a>
                    <a href="/dashboard" style={link_style}>
                        Dashboard
                    </a>
                    <a href="/recordfile" style={link_style}>
                        RecordFile
                    </a>
                    <a href="/" style={link_style}>
                        Logout
                    </a>
                </div>
            </div>

            {/* Approved Leave Records Table */}
            <h2 style={heading_style}>Approved Leave Records</h2>
            <table style={table_style}>
                <thead>
                    <tr style={header_row_style}>
                        <th style={table_header_style}>Employee Name</th>
                        <th style={table_header_style}>Leave Type</th>
                        <th style={table_header_style}>Start Date</th>
                        <th style={table_header_style}>End Date</th>
                        <th style={table_header_style}>Reason</th>
                        <th style={table_header_style}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="6" style={{ ...table_header_style, textAlign: "center" }}>
                            No approved leaves found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
