import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/register", {
        username,
        password,
        name,
      });
      console.log(response.data);
      setSuccess(true);
      // Redirect to homepage
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Show Password</label>
        <input
          type="checkbox"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
        />
        <button type="submit">Register</button>
        <p>
            Already have an account?{" "}
            <Link to="/">Login</Link>
        </p>
        {success && <div className="success">Registration successful!</div>}
      </form>
    </div>
  );
};

export default RegisterPage;
