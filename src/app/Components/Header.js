// src/app/Header/page.js
'use client'
import React, { useEffect, useState } from "react";
import styles from '../styles/SortableTable.module.css';
import { db } from '../Services/auth';
import { collection, getDocs } from "firebase/firestore";

const Result = ({ selectedCountry }) => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantsCollection = collection(db, 'applicants');
        const applicantsSnapshot = await getDocs(applicantsCollection);
        const applicantsData = applicantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter applicants based on the selected country
        const filteredApplicants = selectedCountry ? applicantsData.filter(applicant => applicant.evaluatee.country === selectedCountry) : applicantsData;
        
        setApplicants(filteredApplicants);
      } catch (error) {
        console.error("Error fetching applicants: ", error);
      }
    };

    fetchApplicants();
  }, [selectedCountry]); // Re-fetch applicants when the selected country changes

  return (
    <div id="wrapper" className={styles.wrapper}>
      <h1>Applicants</h1>
      {applicants.length === 0 ? (
        <p>No applicants found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Evaluator Name</th>
              <th>Evaluator Country</th>
              <th>Evaluatee Name</th>
              <th>Evaluatee Country</th>
              <th>Scores</th>
              <th>Total Points</th>
              <th>Percentage</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.id}>
                <td>{applicant.evaluator.name}</td>
                <td>{applicant.evaluator.country}</td>
                <td>{applicant.evaluatee.name}</td>
                <td>{applicant.evaluatee.country}</td>
                <td>
                  <ul>
                    {Object.entries(applicant.scores).map(([criterion, score]) => (
                      <li key={criterion}>{criterion}: {score}</li>
                    ))}
                  </ul>
                </td>
                <td>{applicant.results.totalPoints}</td>
                <td>{applicant.results.percentage.toFixed(2)}%</td>
                <td>{applicant.evaluator.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Result;
