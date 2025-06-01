// src/pages/Home.jsx
import styles from './Home.module.css';
import React from "react";

export function Home() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to the Health App</h2>
      <p className={styles.subtitle} >Use the navigation links above to submit or view health data.</p>
    </div>
  );
}
