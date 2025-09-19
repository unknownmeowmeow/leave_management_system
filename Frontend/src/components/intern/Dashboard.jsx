import React from "react";

export default function Dashboard() {
    const header_container_style = {
        textAlign: "center",
        marginTop: "50px",
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

    return (
        <div style={header_container_style}>

            <h1>welcome intern</h1>
            <button style={button_style}>Time IN</button>
            <button style={button_style}>Time Out</button>
            <a href="/" style={link_style}>
                Logout
            </a>
        </div>
    );
}
