//src/components/MainPage/HomePage.js
import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        console.log("Logout Success");
        logout();
        navigate("/");
    };

    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;