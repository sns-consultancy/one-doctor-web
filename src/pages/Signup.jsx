import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Signup.module.css';

const API_URL = process.env.REACT_APP_API_URL;

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMessage(data.message);
        setTimeout(() => navigate('/login'), 1500); // Redirect after 1.5s
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      setMessage("Signup failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Signup</h2>
      <input
        className={styles.input}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <input
        className={styles.input}
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button className={styles.button} onClick={handleSignup}>Signup</button>
      {message && <p className={styles.message}>{message}</p>}
      <p className={styles.signupOption}>
        Already have an account? <Link to="/login" className={styles.signupLink}>Login</Link>
      </p>
    </div>
  );
}

export default Signup;