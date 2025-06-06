import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <Link to="/home" className={location.pathname === "/home" ? styles.active : styles.link}>Home</Link>
      <Link to="/view" className={location.pathname === "/view" ? styles.active : styles.link}>View Data</Link>
      <Link to="/submit" className={location.pathname === "/submit" ? styles.active : styles.link}>Submit Data</Link>
      <button className={styles.logout} onClick={handleLogout}>Logout</button>
    </nav>
  );
}