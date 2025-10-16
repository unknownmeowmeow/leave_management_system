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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password },
                { withCredentials: true }
            );

            if (data.status) {
                const user = data.user;
                const role = Number(user.role);

                if (!isNaN(role)) {
                    if (role === 1) navigate("/admin");
                    else if (role === 2) navigate("/interndashboard");
                    else if (role === 3) navigate("/dashboard");
                    else setError("Unknown role type");
                } else {
                    setError("Role not recognized. Please contact admin.");
                }
            } else {
                setError(data.error);
            }
        } catch (error) {
            const msg = error?.response?.data?.error || error?.message || "Server error occurred.";
            setError(msg);
        } finally {
            setLoading(false);
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
                            type="text"
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

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-3">
                    Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
