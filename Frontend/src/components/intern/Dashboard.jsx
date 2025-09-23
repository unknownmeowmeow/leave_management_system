import React from "react";
import axios from "axios";

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

    const handleTimeIn = async () => {

        try {
            const res = await axios.post("http://localhost:5000/api/attendance/timein", {}, {
                withCredentials: true
            });

            alert(res.data.message);
        } 
        catch(error){
            alert("Time In failed: " + (error.response?.data?.message));
        }
    };

    const handleTimeOut = async () => {
        try {
            console.log("Sending Time OUT request...");

            const res = await axios.post("http://localhost:5000/api/attendance/timeout", {}, {
                withCredentials: true
            });
            console.log("check the response data", res.data);

            if(res.data.success){
                alert(res.data.message || "Time Out successful");
            } 
            else{
                console.warn("Time Out failed with message:", res.data.message);
                alert("Time Out failed: " + (res.data.message));
            }
        }
        catch(error){
            console.error("Time OUT request error:", error);

            const errorMessage = error.response?.data?.message || error.message;
            console.log("Detailed error message:", errorMessage);

            alert("Time Out failed: " + errorMessage);
        }
    };

    return (
        <div style={header_container_style}>
            <h1>Welcome Intern</h1>
            <button style={button_style} onClick={handleTimeIn}>Time IN</button>
            <button style={button_style} onClick={handleTimeOut}>Time Out</button>
            <a href="/" style={link_style}>Logout</a>
        </div>
    );
}
