import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import { useAuth, AuthProvider } from "./auth/AuthContext";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import HomePage from "./components/MainPage/HomePage";

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? element : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/home" element={<ProtectedRoute element={<HomePage/>}/>}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;