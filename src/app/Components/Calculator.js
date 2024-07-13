'use client'

import React, { useState } from 'react';
import styles from '../styles/Calculator.module.css';
import { db } from '../Services/auth'; // Adjust the path according to your project structure
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 

const Calculator = () => {
  const criteria = [
    { name: "Academic and Professional Background", weight: 25, points: 25, description: "Evaluates the relevance of the current position and the highest academic degree obtained. Preference for applicants in advanced roles in neuroscience, radiology, or related fields. Strong preference for candidates with advanced degrees (Master’s or Ph.D.) in relevant fields." },
    { name: "Programming Skills", weight: 20, points: 20, description: "Assesses foundational and specific programming skills, especially in Python. Mandatory requirement for foundational programming skills. Proficiency in Python required, with evidence of prior use in data science and analysis projects." },
    { name: "FAIR Data Experience", weight: 10, points: 10, description: "Evaluates demonstrable experience in creating Findable, Accessible, Interoperable, and Reusable brain data. Demonstrable experience in creating FAIR brain data is mandatory." },
    { name: "MRI Data Collection Experience", weight: 20, points: 20, description: "Assesses experience in collecting brain MRI data and the quality of that experience. Required for all applicants, with preference for substantial experience. Evaluation of the depth, scope, and impact of previous MRI data collection work." },
    { name: "Research Interests and Experience", weight: 10, points: 10, description: "Assesses the depth and relevance of previous research and collected data. Detailed descriptions of previous research with a focus on relevance to the program’s objectives (MRI || fMRI)." },
    { name: "Motivation and Commitment", weight: 5, points: 5, description: "Evaluates the applicant’s motivation, commitment, and alignment of the program with their career goals. Compelling statement articulating the applicant’s motivation, goals, and how the program fits into their career path. Evidence of the ability to commit to the full program duration, including preparatory work and potential follow-up activities." },
  ];

  const [scores, setScores] = useState({});
  const [results, setResults] = useState({ totalPoints: 0, totalWeight: 0, percentage: 0 });
  const [evaluator, setEvaluator] = useState({ name: "", country: "", comment: "" });
  const [evaluatee, setEvaluatee] = useState({ name: "", country: "" });

  const handleInputChange = (e, criterion) => {
    const { value } = e.target;
    setScores((prevScores) => ({
      ...prevScores,
      [criterion.name]: Number(value),
    }));
  };

  const handleEvaluatorChange = (e) => {
    const { name, value } = e.target;
    setEvaluator((prevEvaluator) => ({
      ...prevEvaluator,
      [name]: value,
    }));
  };

  const handleEvaluateeChange = (e) => {
    const { name, value } = e.target;
    setEvaluatee((prevEvaluatee) => ({
      ...prevEvaluatee,
      [name]: value,
    }));
  };

  const calculateResults = () => {
    let totalPoints = 0;
    let totalWeight = 0;
    criteria.forEach((criterion) => {
      const score = scores[criterion.name] || 0;
      totalPoints += score;
      totalWeight += criterion.weight;
    });
    const percentage = (totalPoints / totalWeight) * 100;
    setResults({ totalPoints, totalWeight, percentage });
  };

  const saveData = async () => {
    try {
      await addDoc(collection(db, 'applicants'), {
        evaluator,
        evaluatee,
        scores,
        results,
        timestamp: serverTimestamp()
      });
      alert('Data saved successfully!');
      clearInputs();
    } catch (error) {
      console.error('Error saving data: ', error);
      alert('Failed to save data.');
    }
  };

  const clearInputs = () => {
    setScores({});
    setEvaluator({ name: "", country: "", comment: "" });
    setEvaluatee({ name: "", country: "" });
    setResults({ totalPoints: 0, totalWeight: 0, percentage: 0 });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}> ABDS Academy 2024 Evaluation Sheet</h1>

      <div className={styles.personalInfo}>
        <div className={styles.personalInfoGroup}>
          <label htmlFor="evaluatorName">Evaluator's Name:</label>
          <input
            type="text"
            id="evaluatorName"
            name="name"
            value={evaluator.name}
            onChange={handleEvaluatorChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.personalInfoGroup}>
          <label htmlFor="evaluatorCountry">Evaluator's Country:</label>
          <input
            type="text"
            id="evaluatorCountry"
            name="country"
            value={evaluator.country}
            onChange={handleEvaluatorChange}
            className={styles.input}
          />
        </div>
        <div className={styles.personalInfoGroup}>
          <label htmlFor="evaluateeName">Evaluatee's Name:</label>
          <input
            type="text"
            id="evaluateeName"
            name="name"
            value={evaluatee.name}
            onChange={handleEvaluateeChange}
            className={styles.input}
          />
        </div>
        <div className={styles.personalInfoGroup}>
          <label htmlFor="evaluateeCountry">Evaluatee's Country:</label>
          <input
            type="text"
            id="evaluateeCountry"
            name="country"
            value={evaluatee.country}
            onChange={handleEvaluateeChange}
            className={styles.input}
          />
        </div>
        <div className={styles.personalInfoGroup}>
          <label htmlFor="evaluatorComment">Evaluator's Comment:</label>
          <textarea
            id="evaluatorComment"
            name="comment"
            value={evaluator.comment}
            onChange={handleEvaluatorChange}
            className={styles.textarea}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Criteria</th>
            <th>Weight (%)</th>
            <th>Points</th>
            <th>Description</th>
            <th>Input</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((criterion, i) => (
            <tr key={i} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              <td>{criterion.name}</td>
              <td>{criterion.weight}%</td>
              <td>{criterion.points}</td>
              <td>{criterion.description}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max={criterion.points}
                  value={scores[criterion.name] || ""}
                  onChange={(e) => handleInputChange(e, criterion)}
                  className={styles.input}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={calculateResults} className={styles.button}>Calculate</button>
      <button onClick={saveData} className={styles.button}>Save Data</button>
      <button onClick={clearInputs} className={styles.button}>Clear Inputs</button>
      <div className={styles.results}>
        <h3>Total Points: {results.totalPoints}</h3>
        <h3>Total Weight: {results.totalWeight}</h3>
        <h3>Percentage: {results.percentage.toFixed(2)}%</h3>
      </div>
    </div>
  );
};

export default Calculator;
