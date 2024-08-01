'use client'

import React, { useState, useEffect } from 'react';
import styles from '../styles/Calculator.module.css';
import { db } from '../Services/auth'; // Adjust the path according to your project structure
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { useDetailContext } from '../Steps/DetailContext';
import SelectApplicant from '../Components/SelectApplicant';
import ApplicantDetail from '../Components/ApplicantDetail';
import UserGuide from '../Components/UserGuide';

const Calculator = () => {
  const data = useDetailContext();
  console.log(data.selectedApplicant)

  const criteria = [
    { name: "Academic and Professional Background", weight: 25, points: 25, description: "Evaluates the relevance of the current position and the highest academic degree obtained. Preference for applicants in advanced roles in neuroscience, radiology, or related fields. Strong preference for candidates with advanced degrees (Master’s or Ph.D.) in relevant fields." },
    { name: "Programming Skills", weight: 20, points: 20, description: "Assesses foundational and specific programming skills, especially in Python. Mandatory requirement for foundational programming skills. Proficiency in Python required, with evidence of prior use in data science and analysis projects." },
    { name: "FAIR Data Experience", weight: 20, points: 20, description: "Evaluates demonstrable experience in creating Findable, Accessible, Interoperable, and Reusable brain data. Demonstrable experience in creating FAIR brain data is mandatory." },
    { name: "MRI Data Collection Experience", weight: 20, points: 20, description: "Assesses experience in collecting brain MRI data and the quality of that experience. Required for all applicants, with preference for substantial experience. Evaluation of the depth, scope, and impact of previous MRI data collection work." },
    { name: "Research Interests and Experience", weight: 10, points: 10, description: "Assesses the depth and relevance of previous research and collected data. Detailed descriptions of previous research with a focus on relevance to the program’s objectives (MRI || fMRI)." },
    { name: "Motivation and Commitment", weight: 5, points: 5, description: "Evaluates the applicant’s motivation, commitment, and alignment of the program with their career goals. Compelling statement articulating the applicant’s motivation, goals, and how the program fits into their career path. Evidence of the ability to commit to the full program duration, including preparatory work and potential follow-up activities." },
  ];

  const [scores, setScores] = useState({});
  const [results, setResults] = useState({ totalPoints: 0, totalWeight: 0, percentage: 0 });
  const [evaluator, setEvaluator] = useState({ name: "", country: "", comment: "" });
  const [evaluatee, setEvaluatee] = useState({ name: "", country: "" });
  const [loading, setLoading] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [showGuide, setShowGuide] = useState(true); // State to control the guide popup


  useEffect(() => {
    if (data.selectedApplicant) {
      setEvaluatee({
        name: `${data.selectedApplicant["First Name"]} ${data.selectedApplicant["Last Name"]}`,
        country: data.selectedApplicant["Country of residence"],
      });
    }
  }, [data.selectedApplicant]);

  const handleInputChange = (e, criterion) => {
    const { value } = e.target;
    const newValue = Math.min(Number(value), criterion.points);
    setScores((prevScores) => ({
      ...prevScores,
      [criterion.name]: newValue,
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
    setCanSave(true);
  };

  const saveData = async () => {
    if (!canSave) return;
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const clearInputs = () => {
    setScores({});
    setEvaluator({ comment: "" });
    setEvaluatee({ name: "", country: "" });
    setResults({ totalPoints: 0, totalWeight: 0, percentage: 0 });
    setCanSave(false);
  };

  return (
    <div className={styles.container}>
           {showGuide && <UserGuide onClose={() => setShowGuide(false)} />} {/* Show the guide if showGuide is true */}
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
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div>
          <SelectApplicant label='Choose an Applicant'/> 
        </div>
        <ApplicantDetail label='Applicant Details'/> 
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
      <div style={{display:'flex', justifyContent:'space-between', textAlign:'left', width:'50%'}}>
        <button onClick={calculateResults} className={styles.button}>Calculate</button>
        <button onClick={saveData} className={styles.button} disabled={!canSave || loading}>
          {loading ? 'Saving...' : 'Save Data'}
        </button>
        <button onClick={clearInputs} className={styles.button}>Clear Inputs</button>
      </div>
      <div className={styles.results}>
        <h3>Total Points: {results.totalPoints}</h3>
        <h3>Total Weight: {results.totalWeight}</h3>
        <h3>Percentage: {results.percentage.toFixed(2)}%</h3>
      </div>
    </div>
  );
};

export default Calculator;
