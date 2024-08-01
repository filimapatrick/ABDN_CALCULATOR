'use client'

import React, { useEffect, useState } from "react";
import { Button, Drawer, Space, Input, Pagination } from 'antd';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setSelectedCountry('');
    setFilteredApplicants(applicants.filter(applicant => applicant.evaluatee.name.toLowerCase().includes(searchQuery.toLowerCase())));
    setCurrentPage(1);
  };

  const sortApplicantsByTotalPointsAndName = (applicants) => {
    return applicants.sort((a, b) => {
      if (b.results.totalPoints !== a.results.totalPoints) {
        return b.results.totalPoints - a.results.totalPoints;
      } else {
        return a.evaluatee.name.localeCompare(b.evaluatee.name);
      }
    });
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedApplicants = sortApplicantsByTotalPointsAndName(filteredApplicants).slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div id="wrapper" className={styles.wrapper}>
      <div>
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
          {selectedCountry && (
            <Button onClick={clearFilter}>
              Clear Filter
            </Button>
          )}
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
              <div key={index} className={styles.filter_country}>
                <p
                  onClick={() => filterByCountry(country)}
                  style={{ cursor: 'pointer', color: 'blue' }}
                >
                  {country}
                </p>
              
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
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
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
              {paginatedApplicants.map((applicant, index) => (
                <tr key={applicant.id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
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
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredApplicants.length}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={[10, 20, 50, 100]}
            style={{ marginTop: 16, textAlign: 'center' }}
          />
        </>
      )}
    </div>
  );
};

export default Result;
