import React from "react";

const LeaveFile = () => {
    // Main container styling
    const containerStyle = {
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
    };

    // Header container styling
    const header_container_style = {
        textAlign: "center",
        marginTop: "30px",
        marginBottom: "30px",
    };

    const headingStyle = {
        textAlign: "center",
        marginBottom: "20px",
    };

    const formStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    };

    const labelStyle = {
        display: "flex",
        flexDirection: "column",
        fontSize: "14px",
    };

    const inputStyle = {
        padding: "8px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    };

    const buttonStyle = {
        padding: "10px",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
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

    const successMessageStyle = {
        backgroundColor: "#d4edda",
        color: "#155724",
        padding: "10px",
        borderRadius: "4px",
        marginBottom: "20px",
        textAlign: "center",
    };

    return (
        <div style={containerStyle}>
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

            <div style={successMessageStyle}>Submitted Request Successfully</div>

            <h2 style={headingStyle}>Leave Application Form</h2>

            <form style={formStyle}>
                <label style={labelStyle}>
                    Leave Type:
                    <select name="leaveType" style={inputStyle}>
                        <option value="">Select Leave Type</option>
                        <option value="sick">Sick Leave</option>
                        <option value="casual">Casual Leave</option>
                        <option value="earned">Earned Leave</option>
                    </select>
                </label>

                <label style={labelStyle}>
                    Start Date:
                    <input type="date" name="startDate" style={inputStyle} />
                </label>

                <label style={labelStyle}>
                    End Date:
                    <input type="date" name="endDate" style={inputStyle} />
                </label>

                <label style={labelStyle}>
                    Reason:
                    <input
                        type="text"
                        name="reason"
                        placeholder="Enter your reason"
                        style={inputStyle}
                    />
                </label>

                <button type="submit" style={buttonStyle}>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default LeaveFile;
