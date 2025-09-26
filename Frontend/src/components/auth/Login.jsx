import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password },
                { withCredentials: true }
            );

            if (response.data.success) {
                const user = response.data.user;
                const role = user.role;

                if (role === 1) {
                    navigate("/admin");
                }
                else if (role === 2) {
                    navigate("/interndashboard");
                }
                else if (role === 3) {
                    navigate("/dashboard");
                }
                else {
                    if (response.data.errors) {

                        setError(response.data.errors);
                    }
                    else if (response.data.message) {
                        setError(response.data.message);
                    }
                    else {
                        setError("An unknown error occurred.");
                    }
                }
            }
            else {
                if (response.data.errors) {

                    setError(response.data.errors);
                }
                else if (response.data.message) {
                    setError(response.data.message);
                }
                else {
                    setError("An unknown error occurred.");
                }
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError("Server Error in Login Frontend ");
            }
        }
    };

    return (
        <div className="container" style={{ maxWidth: "400px", marginTop: "50px" }}>
            <div className="card shadow-sm p-4">
                <h2 className="text-center mb-4">Login</h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}

                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}

                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>

                <p className="text-center mt-3">
                    Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
