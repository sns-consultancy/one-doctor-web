import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from './components/NavBar';
import  Home  from "./pages/Home";
import { SubmitHealthData } from "./pages/SubmitHealthData";
import { ViewHealthData } from "./pages/ViewHealthData";
import { MedicalHistory } from "./pages/MedicalHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import "./App.css";
import {
  Home as HomeIcon,
  FilePlus,
  Eye,
  FileText,
  Info,
  FileLock,
  Mail,
  Moon,
  Sun
} from "lucide-react";
function AppContent() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const toggleDropdown = () => setShowDropdown(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);
  const handleNav = (path) => {
    navigate(path);
    setShowDropdown(false);
  };
  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <Navbar />
      <div className="banner">
        <div className="menu-actions">
          <button className="menu-button" onClick={toggleDropdown}>☰ Menu</button>
          <button className="toggle-theme" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="dropdown-list" ref={dropdownRef}>
            <ul className="dropdown-menu-list">
              <li onClick={() => handleNav("/home")}><HomeIcon size={16} /> Home</li>
              <li onClick={() => handleNav("/submit")}><FilePlus size={16} /> Submit Data</li>
              <li onClick={() => handleNav("/view")}><Eye size={16} /> View Data</li>
              <li onClick={() => handleNav("/medical-history")}><FileText size={16} /> Medical History</li>
              <li onClick={() => handleNav("/about")}><Info size={16} /> About Us</li>
              <li onClick={() => handleNav("/terms")}><FileLock size={16} /> Terms & Conditions</li>
              <li onClick={() => handleNav("/contact")}><Mail size={16} /> Contact Us</li>
            </ul>
          </div>
        )}
        <h1>Welcome to One Doctor App</h1>
        <p>Your AI-powered health assistant – anytime, anywhere.</p>
      </div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/submit" element={<ProtectedRoute><SubmitHealthData /></ProtectedRoute>} />
        <Route path="/view" element={<ProtectedRoute><ViewHealthData /></ProtectedRoute>} />
        <Route path="/medical-history" element={<ProtectedRoute><MedicalHistory /></ProtectedRoute>} />
      </Routes>
      <footer>
        <p>© 2025 One Doctor App. All rights reserved.</p>
      </footer>
    </div>
  );
}
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}