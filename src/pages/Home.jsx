import styles from './Home.module.css';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, PlusCircle, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { getMedicalHistory } from "../services/healthService";
import NavBar from '../components/NavBar';

export function Home() {
  const [hasMedicalHistory, setHasMedicalHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMedicalHistory = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await getMedicalHistory(userId);
          // If we have data, user has medical history
          setHasMedicalHistory(response && response.data ? true : false);
        }
      } catch (error) {
        console.error("Error checking medical history:", error);
        // Assume no medical history in case of error
        setHasMedicalHistory(false);
      } finally {
        setLoading(false);
      }
    };

    checkMedicalHistory();
  }, []);

  return (
    <div className={styles.root}>
      <NavBar />
      <div className={styles.header}>
        <img src="/female-doctor.PNG" alt="Doctor Female" className={styles.doctorImage} />
        <div>
          <h1 className={styles.title}>One Doctor App</h1>
          <p className={styles.subtitle}>Your personal AI health assistant</p>
        </div>
        <img src="/maledoctor.PNG" alt="Doctor Male" className={styles.doctorImage} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.cardGrid}
      >
        <Link
          to="/medical-history"
          className={`${styles.card} ${loading ? styles.cardLoading : ''}`}
        >
          {loading ? (
            <div className={styles.cardLoaderContainer}>
              <div className={styles.cardLoader}></div>
            </div>
          ) : (
            <>
              {hasMedicalHistory ? (
                <ClipboardList className={styles.icon} size={36} />
              ) : (
                <PlusCircle className={styles.icon} size={36} />
              )}
              
              <h2 className={styles.cardTitle}>
                {hasMedicalHistory ? 'View Medical History' : 'Initial Medical History'}
              </h2>
              
              <p className={styles.cardDescription}>
                {hasMedicalHistory 
                  ? 'View and update your medical information' 
                  : 'Complete your initial medical history profile'}
              </p>
            </>
          )}
        </Link>
      </motion.div>
    </div>
  );
}