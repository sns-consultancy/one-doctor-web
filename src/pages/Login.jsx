import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Signup.module.css';

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        localStorage.setItem('token', data.access_token);
        setMessage("Login successful");
        setTimeout(() => navigate('/home'), 1000); // Redirect to /home after 1s
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Login failed");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
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
      <button className={styles.button} onClick={handleLogin}>Login</button>
      {message && <p className={styles.message}>{message}</p>}
      <p className={styles.signupOption}>
        Don't have an account? <Link to="/signup" className={styles.signupLink}>Sign up</Link>
      </p>
    </div>
  );
}

export default Login;