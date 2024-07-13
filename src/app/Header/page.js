'use client'
import React, { useEffect, useState } from "react";
import { Button, Drawer, Space, Input } from 'antd';
import styles from '../styles/SortableTable.module.css';
import { db } from '../Services/auth';
import { collection, getDocs } from "firebase/firestore";

const Result = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantsCollection = collection(db, 'applicants');
        const applicantsSnapshot = await getDocs(applicantsCollection);
        const applicantsData = applicantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplicants(applicantsData);
        setFilteredApplicants(applicantsData);

        const countriesData = applicantsSnapshot.docs.map(doc => doc.data().evaluatee.country);
        const uniqueCountries = [...new Set(countriesData)];
        setCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching applicants: ", error);
      }
    };

    fetchApplicants();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const filterByCountry = (country) => {
    setSelectedCountry(country);
    const filtered = applicants.filter(applicant => 
      applicant.evaluatee.country === country && 
      applicant.evaluatee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredApplicants(filtered);
    onClose();
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = applicants.filter(applicant => 
      applicant.evaluatee.name.toLowerCase().includes(query.toLowerCase()) && 
      (selectedCountry ? applicant.evaluatee.country === selectedCountry : true)
    );
    setFilteredApplicants(filtered);
  };

  const sortApplicantsByTotalPoints = (applicants) => {
    return applicants.sort((a, b) => b.results.totalPoints - a.results.totalPoints);
  };

  return (
    <div id="wrapper" className={styles.wrapper}>
      <div className={styles.navbar}>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={showDrawer}>
            Filter by Country
          </Button>
          <Input 
            placeholder="Search by name" 
            value={searchQuery} 
            onChange={handleSearch} 
            style={{ width: 200 }}
          />
        </Space>
        <Drawer
          title="Filter by Country"
          placement={placement}
          closable={false}
          onClose={onClose}
          open={open}
          key={placement}
        >
          {countries.length > 0 ? (
            countries.map((country, index) => (
              <div key={index}>
                <p
                  onClick={() => filterByCountry(country)}
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  {country}
                </p>
                <hr style={{ borderTop: '1px solid gray' }} />
              </div>
            ))
          ) : (
            <p>No countries available</p>
          )}
        </Drawer>
        <h1>Applicants {selectedCountry && `from ${selectedCountry}`}</h1>
      </div>
      {filteredApplicants.length === 0 ? (
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
            {sortApplicantsByTotalPoints(filteredApplicants).map((applicant) => (
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
