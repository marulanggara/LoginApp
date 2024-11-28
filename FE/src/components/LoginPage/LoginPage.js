// src/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./LoginPage.css"; // Optional: for custom styling

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function Login 
  const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:4000/login', {
            username,
            password
        });
        console.log(response.data);
        login();
        // Redirect to homepage
        navigate('/home');
    } catch (error) {
        console.error(error);
        setError(error.response?.data?.message || 'Login failed');
    }
  }

  // handle Subtmit to Login 
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
        {/* Add Login with google */}
        <button type="button" >Login with Google</button>
      </form>
    </div>
  );
};

export default LoginPage;
