import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Save, Clipboard, Heart, Activity, AlertCircle, 
  Pill, ScrollText, Loader, CheckCircle, Trash
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/NavBar";
import { getMedicalHistory, saveMedicalHistory } from "../services/healthService";
import styles from "./MedicalHistory.module.css";

export function MedicalHistory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Form data state matching the API structure
  const [formData, setFormData] = useState({
    user_id: "",
    conditions: [],
    otherConditions: "",
    allergies: [],
    otherAllergies: "",
    medications: [],
    otherMedications: "",
    surgeries: [],
    otherSurgeries: "",
    family_history: {
      heart_disease: false,
      diabetes: false,
      cancer: false,
      hypertension: false,
      stroke: false,
      mental_illness: false,
      other: ""
    },
    last_updated: new Date().toISOString()
  });

  // Check for token and get userId on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Extract user ID from token or get it from local storage
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
      setFormData(prev => ({ ...prev, user_id: userIdFromStorage }));
      fetchMedicalHistory(userIdFromStorage);
    } else {
      setError("User ID not found. Please log in again.");
    }
  }, [navigate]);
  
  // Load draft from localStorage if available
  useEffect(() => {
    if (userId) {
      const savedDraft = localStorage.getItem('medicalHistoryDraft');
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          if (parsedDraft.user_id === userId) {
            setFormData(parsedDraft);
          }
        } catch (e) {
          console.error("Could not parse saved draft");
        }
      }
    }
  }, [userId]);
  
  // Auto-save draft every 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.conditions.length > 0 || formData.allergies.length > 0) {
        localStorage.setItem('medicalHistoryDraft', JSON.stringify(formData));
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearTimeout(timer);
  }, [formData]);

  const fetchMedicalHistory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMedicalHistory(id);
      
      if (response.data) {
        // Transform API data to form data structure
        setFormData({
          user_id: id,
          conditions: response.data.conditions || [],
          allergies: response.data.allergies || [],
          medications: response.data.medications || [],
          surgeries: response.data.surgeries || [],
          family_history: response.data.family_history || {
            heart_disease: false,
            diabetes: false, 
            cancer: false,
            hypertension: false,
            stroke: false,
            mental_illness: false,
            other: ""
          },
          last_updated: response.data.last_updated || new Date().toISOString(),
          otherConditions: "",
          otherAllergies: "",
          otherMedications: "",
          otherSurgeries: ""
        });
      }
    } catch (err) {
      console.error("Error fetching medical history:", err);
      setError("Failed to load your medical history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      if (prev[category].includes(value)) {
        return {
          ...prev,
          [category]: prev[category].filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [category]: [...prev[category], value]
        };
      }
    });
  };

  const handleFamilyHistoryChange = (condition, value) => {
    setFormData(prev => ({
      ...prev,
      family_history: {
        ...prev.family_history,
        [condition]: value
      }
    }));
  };



  const handleArrayInputChange = (category, e) => {
    const { value } = e.target;
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [`other${category.charAt(0).toUpperCase() + category.slice(1)}`]: value
      }));
    }
  };

  const addCustomItem = (category) => {
    const fieldName = `other${category.charAt(0).toUpperCase() + category.slice(1)}`;
    const value = formData[fieldName]?.trim();
    
    if (value) {
      setFormData(prev => ({
        ...prev,
        [category]: [...prev[category], value],
        [fieldName]: ""
      }));
    }
  };
  
  const resetForm = () => {
    // Show confirmation first
    if (window.confirm("Are you sure you want to clear all entries?")) {
      setFormData({
        user_id: userId,
        conditions: [],
        otherConditions: "",
        allergies: [],
        otherAllergies: "",
        medications: [],
        otherMedications: "",
        surgeries: [],
        otherSurgeries: "",
        family_history: {
          heart_disease: false,
          diabetes: false,
          cancer: false,
          hypertension: false,
          stroke: false,
          mental_illness: false,
          other: ""
        },
        last_updated: new Date().toISOString()
      });
      // Also remove draft from localStorage
      localStorage.removeItem('medicalHistoryDraft');
    }
  };

  // Pre-validation before showing confirmation dialog
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form data
    if (formData.conditions.length === 0) {
      setError("Please select at least one medical condition");
      return;
    }
    
    setError(null);
    // Show confirmation dialog
    setShowConfirm(true);
  };
  
  // Actual form submission after confirmation
  const submitForm = async () => {
    setSaving(true);
    
    try {
      // Prepare data for API
      const dataToSave = {
        user_id: userId,
        conditions: formData.conditions,
        allergies: formData.allergies,
        medications: formData.medications,
        surgeries: formData.surgeries,
        family_history: formData.family_history,
        last_updated: new Date().toISOString()
      };
      
      await saveMedicalHistory(dataToSave);
      setSuccess(true);
      
      // Clear draft after successful save
      localStorage.removeItem('medicalHistoryDraft');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error saving medical history:", err);
      setError("Failed to save your medical history. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.root}>
        <NavBar />
        <div className={styles.loadingContainer}>
          <Loader className={styles.loadingIcon} size={40} />
          <p>Loading your medical history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <NavBar />
      <div className={styles.container}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>
            <Clipboard className={styles.titleIcon} />
            Medical History
          </h1>
          <p className={styles.subtitle}>
            Please provide your medical information to help us serve you better
          </p>
        </motion.div>

        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <motion.div 
            className={styles.successMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle size={20} />
            Your medical history has been saved successfully!
          </motion.div>
        )}

        <motion.form 
          className={styles.form}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
        >
          {/* Medical Conditions Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Heart size={20} />
              Medical Conditions
            </h2>
            <div className={styles.formGroup}>
              <label className={styles.checkboxGroupLabel}>
                Do you have any of these medical conditions? (select all that apply)
              </label>
              <div className={styles.checkboxGrid}>
                {[
                  "Diabetes", "Hypertension", "Asthma", "Heart Disease", 
                  "COPD", "Cancer", "Arthritis", "Thyroid Disease",
                  "Kidney Disease", "Liver Disease", "Depression", "Anxiety"
                ].map((condition) => (
                  <div className={styles.checkboxOption} key={condition}>
                    <input
                      type="checkbox"
                      id={`condition${condition.replace(/\s+/g, '')}`}
                      checked={formData.conditions.includes(condition)}
                      onChange={() => handleCheckboxChange('conditions', condition)}
                    />
                    <label htmlFor={`condition${condition.replace(/\s+/g, '')}`}>{condition}</label>
                  </div>
                ))}
              </div>
              
              <div className={styles.addCustomField}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter other condition"
                  value={formData.otherConditions}
                  onChange={(e) => handleArrayInputChange('conditions', e)}
                />
                <button 
                  type="button" 
                  className={styles.addButton}
                  onClick={() => addCustomItem('conditions')}
                  disabled={!formData.otherConditions.trim()}
                >
                  Add
                </button>
              </div>
              
              {formData.conditions.length > 0 && (
                <div className={styles.selectedItems}>
                  <p>Selected conditions:</p>
                  <div className={styles.tagList}>
                    {formData.conditions.map((condition, index) => (
                      <div className={styles.tag} key={index}>
                        {condition}
                        <button 
                          type="button"
                          onClick={() => handleCheckboxChange('conditions', condition)}
                          className={styles.removeTag}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Allergies Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <AlertCircle size={20} />
              Allergies
            </h2>
            <div className={styles.formGroup}>
              <label className={styles.checkboxGroupLabel}>
                Do you have any of these allergies? (select all that apply)
              </label>
              <div className={styles.checkboxGrid}>
                {[
                  "Penicillin", "Peanuts", "Latex", "Insect Stings", "Eggs",
                  "Tree Nuts", "Shellfish", "Milk", "Soy", "Wheat", "Sulfa Drugs"
                ].map((allergy) => (
                  <div className={styles.checkboxOption} key={allergy}>
                    <input
                      type="checkbox"
                      id={`allergy${allergy.replace(/\s+/g, '')}`}
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => handleCheckboxChange('allergies', allergy)}
                    />
                    <label htmlFor={`allergy${allergy.replace(/\s+/g, '')}`}>{allergy}</label>
                  </div>
                ))}
              </div>
              
              <div className={styles.addCustomField}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter other allergy"
                  value={formData.otherAllergies}
                  onChange={(e) => handleArrayInputChange('allergies', e)}
                />
                <button 
                  type="button" 
                  className={styles.addButton}
                  onClick={() => addCustomItem('allergies')}
                  disabled={!formData.otherAllergies.trim()}
                >
                  Add
                </button>
              </div>
              
              {formData.allergies.length > 0 && (
                <div className={styles.selectedItems}>
                  <p>Selected allergies:</p>
                  <div className={styles.tagList}>
                    {formData.allergies.map((allergy, index) => (
                      <div className={styles.tag} key={index}>
                        {allergy}
                        <button 
                          type="button" 
                          onClick={() => handleCheckboxChange('allergies', allergy)}
                          className={styles.removeTag}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medications Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Pill size={20} />
              Current Medications
            </h2>
            <div className={styles.formGroup}>
              <label htmlFor="medications">
                List all medications you are currently taking
              </label>
              <div className={styles.addCustomField}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter medication (e.g., Lisinopril 10mg daily)"
                  value={formData.otherMedications}
                  onChange={(e) => handleArrayInputChange('medications', e)}
                />
                <button 
                  type="button" 
                  className={styles.addButton}
                  onClick={() => addCustomItem('medications')}
                  disabled={!formData.otherMedications.trim()}
                >
                  Add
                </button>
              </div>
              
              {formData.medications.length > 0 && (
                <div className={styles.selectedItems}>
                  <p>Current medications:</p>
                  <div className={styles.tagList}>
                    {formData.medications.map((medication, index) => (
                      <div className={styles.tag} key={index}>
                        {medication}
                        <button 
                          type="button" 
                          onClick={() => handleCheckboxChange('medications', medication)}
                          className={styles.removeTag}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.medications.length === 0 && (
                <p className={styles.note}>No medications added yet</p>
              )}
            </div>
          </div>

          {/* Surgeries Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ScrollText size={20} />
              Surgical History
            </h2>
            <div className={styles.formGroup}>
              <label htmlFor="surgeries">
                List any surgeries you've had with years if known
              </label>
              <div className={styles.addCustomField}>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter surgery (e.g., Appendectomy 2010)"
                  value={formData.otherSurgeries}
                  onChange={(e) => handleArrayInputChange('surgeries', e)}
                />
                <button 
                  type="button" 
                  className={styles.addButton}
                  onClick={() => addCustomItem('surgeries')}
                  disabled={!formData.otherSurgeries.trim()}
                >
                  Add
                </button>
              </div>
              
              {formData.surgeries.length > 0 && (
                <div className={styles.selectedItems}>
                  <p>Previous surgeries:</p>
                  <div className={styles.tagList}>
                    {formData.surgeries.map((surgery, index) => (
                      <div className={styles.tag} key={index}>
                        {surgery}
                        <button 
                          type="button" 
                          onClick={() => handleCheckboxChange('surgeries', surgery)}
                          className={styles.removeTag}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.surgeries.length === 0 && (
                <p className={styles.note}>No surgeries added yet</p>
              )}
            </div>
          </div>

          {/* Family History Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Activity size={20} />
              Family History
            </h2>
            <div className={styles.formGroup}>
              <label className={styles.checkboxGroupLabel}>
                Has anyone in your immediate family been diagnosed with:
              </label>
              <div className={styles.familyHistoryOptions}>
                {[
                  { id: 'heart_disease', label: 'Heart Disease' },
                  { id: 'diabetes', label: 'Diabetes' },
                  { id: 'cancer', label: 'Cancer' },
                  { id: 'hypertension', label: 'Hypertension' },
                  { id: 'stroke', label: 'Stroke' },
                  { id: 'mental_illness', label: 'Mental Illness' }
                ].map((condition) => (
                  <div className={styles.checkboxOption} key={condition.id}>
                    <input
                      type="checkbox"
                      id={`family${condition.id}`}
                      checked={formData.family_history[condition.id]}
                      onChange={(e) => handleFamilyHistoryChange(condition.id, e.target.checked)}
                    />
                    <label htmlFor={`family${condition.id}`}>{condition.label}</label>
                  </div>
                ))}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="familyOther">Other family medical conditions:</label>
                <textarea
                  id="familyOther"
                  className={styles.textarea}
                  placeholder="Please describe any other conditions that run in your family"
                  value={formData.family_history.other}
                  onChange={(e) => handleFamilyHistoryChange('other', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.clearButton}
              onClick={resetForm}
            >
              <Trash size={18} />
              Clear Form
            </button>
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <Loader size={18} className={styles.spinningIcon} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Medical History
                </>
              )}
            </button>
          </div>
        </motion.form>
        
        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className={styles.confirmationOverlay}>
            <div className={styles.confirmationDialog}>
              <h3>Submit Medical History?</h3>
              <p>Please confirm that the information you've entered is correct.</p>
              <div className={styles.confirmButtons}>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowConfirm(false);
                    submitForm();
                  }}
                  className={styles.confirmButton}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicalHistory;