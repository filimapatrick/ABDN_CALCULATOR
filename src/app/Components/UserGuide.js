
import React from 'react';
import styles from '../styles/UserGuide.module.css';

const UserGuide = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2> ABDN Applicant Evaluation Guide</h2>
        <p>Follow these steps to evaluate an applicant:</p>
        <ol>
        <li>Click on the button "choose applicant" to select a prefered country/applicant.</li>
          <li>Select an applicant's from the drawer.</li>
          <li>The selected applicant's details will be auto-filled in the 'Evaluatee' fields.</li>
          <li>Enter your name and country in the 'Evaluator' fields.</li>
          <li>Click on the button "Applicant's Detail" to view the applican'ts information</li>
          <li>Review the applicant's details and fill in the scores for each criterion based on the descriptions provided.</li>
          <li>Click the 'Calculate' button to compute the total points and percentage.</li>
          <li>After calculating, you can save the evaluation by clicking the 'Save Data' button.</li>
          <li> Ensure to use the calculate button before you save the data</li>
          <li>You can clear all inputs by clicking the 'Clear Inputs' button.</li>
        </ol>
        <button onClick={onClose} className={styles.button}>Close</button>
      </div>
    </div>
  );
};

export default UserGuide;
