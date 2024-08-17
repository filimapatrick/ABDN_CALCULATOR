import React from 'react';
import styles from '../styles/UserGuide.module.css'; // Adjust the path as needed

const AdminGuide = ({ onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>ABDN Applicant Evaluation Admin Guide</h2>
        <p>Follow these steps to manage and evaluate applicants:</p>
        <ol>
          <li>
            <strong>Filter by Country:</strong> Click the "Filter by Country" button to open the drawer where you can select a country. The list of applicants will be filtered based on your selection.
          </li>
          <li>
            <strong>Search for Applicants:</strong> Use the search bar to find applicants by name. The list of applicants will update to match your search query.
          </li>
          <li>
            <strong>View Applicant's Average:</strong> Click the "View applicant's Average" button to navigate to the page showing average scores for applicants.
          </li>
          <li>
            <strong>Clear Filter:</strong> If you have applied a country filter, click the "Clear Filter" button to reset the filter and show all applicants.
          </li>
          <li>
            <strong>Select Applicants:</strong> Use the checkboxes to select applicants. Selected applicants' scores will be used to calculate average scores.
          </li>
          <li>
            <strong>View Applicant Details:</strong> Click on an applicant's name to open a drawer with detailed information about the selected applicant.
          </li>
          <li>
            <strong>Calculate Average Scores:</strong> Once you have selected the applicants, the system will automatically calculate average scores if there are two evaluations for the same applicant.
          </li>
          <li>
            <strong>Save Average Scores:</strong> After calculating the average scores, you can save the data by clicking the "Save" button in the modal that appears.
          </li>
          <li>
            <strong>Clear Inputs:</strong> You can clear all selections and filters by using the "Clear Inputs" button.
          </li>
        </ol>
        <button onClick={onClose} className={styles.button}>Close</button>
      </div>
    </div>
  );
};

export default AdminGuide;
