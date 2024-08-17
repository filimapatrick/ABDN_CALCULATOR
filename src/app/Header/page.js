"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Space,
  Input,
  Pagination,
  Checkbox,
  Modal,
} from "antd";
import styles from "../styles/SortableTable.module.css";
import { db } from "../Services/auth";
import { collection, getDocs, addDoc } from "firebase/firestore";
import Link from "next/link";
import { useDetailContext } from "../Steps/DetailContext";
import UserGuide from "../Components/UserGuide";
import AdminGuide from "../Components/AdminGuide";

const Result = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState({});
  const [modalContent, setModalContent] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [averageData, setAverageData] = useState(null);
  const {data,setSelectedApplicant } = useDetailContext();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null);
  const [showGuide, setShowGuide] = useState(true);


  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantsCollection = collection(db, "applicants");
        const applicantsSnapshot = await getDocs(applicantsCollection);
        const applicantsData = applicantsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApplicants(applicantsData);
        setFilteredApplicants(applicantsData);

        const countriesData = applicantsSnapshot.docs.map(
          (doc) => doc.data().evaluatee.country
        );
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
    const filtered = applicants.filter(
      (applicant) =>
        applicant.evaluatee.country === country &&
        applicant.evaluatee.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
    setFilteredApplicants(filtered);
    setCurrentPage(1);
    onClose();
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = applicants.filter(
      (applicant) =>
        applicant.evaluatee.name.toLowerCase().includes(query.toLowerCase()) &&
        (selectedCountry
          ? applicant.evaluatee.country === selectedCountry
          : true)
    );
    setFilteredApplicants(filtered);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setSelectedCountry("");
    setFilteredApplicants(
      applicants.filter((applicant) =>
        applicant.evaluatee.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
    setCurrentPage(1);
  };



  const sortApplicantsByName = (applicants) => {
    return applicants.sort((a, b) => {
      return a.evaluatee.name.localeCompare(b.evaluatee.name);
    });
  };
  

  
  const sortApplicantsByNameThenPoints = (applicants) => {
    return applicants.sort((a, b) => {
      // First, sort alphabetically by name
      const nameComparison = a.evaluatee.name.localeCompare(b.evaluatee.name);
      if (nameComparison !== 0) {
        return nameComparison;
      }
      // If names are the same, sort by total points in descending order
      return b.results.totalPoints - a.results.totalPoints;
    });
  };
  
  

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleCheckboxChange = (id, checked) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = { ...prevSelectedRows, [id]: checked };
      const evaluateeCounts = {};

      Object.keys(updatedSelectedRows).forEach((rowId) => {
        if (updatedSelectedRows[rowId]) {
          const applicant = filteredApplicants.find((a) => a.id === rowId);
          const evaluateeName = applicant.evaluatee.name;
          const evaluatorName = applicant.evaluator.name;
          const evaluatorCountry = applicant.evaluator.country;
          const evaluateeCountry = applicant.evaluatee.country;
          const totalPoints = applicant.results.totalPoints;

          if (!evaluateeCounts[evaluateeName]) {
            evaluateeCounts[evaluateeName] = [];
          }
          evaluateeCounts[evaluateeName].push({
            evaluatorName,
            evaluatorCountry,
            evaluateeCountry,
            totalPoints,
            score: applicant.results.totalPoints,
          });
        }
      });

      Object.entries(evaluateeCounts).forEach(([evaluateeName, data]) => {
        if (data.length === 2) {
          showAverageModal(
            evaluateeName,
            data.map((d) => d.score),
            data[0].evaluatorName,
            data[0].evaluatorCountry,
            data[0].evaluateeCountry,
            data[0].totalPoints
          );
        }
      });

      return updatedSelectedRows;
    });
  };



  const handleNameClick = (applicant) => {
    const selectedApplicantName = applicant.evaluatee.name;
    const filteredData = data.filter((entry) => {
      const fullName = `${entry['First Name'].trim()} ${entry['Last Name'].trim()}`;
      return fullName === selectedApplicantName;
    });

    setSelectedApplicant(filteredData);
    setDrawerContent(filteredData); // Set the content for the drawer
    setDrawerVisible(true); // Open the drawer
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setDrawerContent(null); // Clear the drawer content when closed
  };



  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    const updatedSelectedRows = filteredApplicants.reduce((acc, applicant) => {
      acc[applicant.id] = checked;
      return acc;
    }, {});
    setSelectedRows(updatedSelectedRows);
    handleCheckboxChange(); // Trigger checkbox change to handle average calculation
  };

  const showAverageModal = (
    evaluateeName,
    scores,
    evaluatorName,
    evaluatorCountry,
    evaluateeCountry,
    totalPoints
  ) => {
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = total / scores.length;
    setAverageData({
      evaluateeName,
      averageScore: average,
      evaluatorName,
      evaluatorCountry,
      evaluateeCountry,
      totalPoints,
    });
    setModalContent(`
      Evaluatee: ${evaluateeName}
      Average Score: ${average.toFixed(2)}
      Evaluatee Country: ${evaluateeCountry}
     
    `);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (averageData) {
      console.log("Saving data:", averageData); 
      try {
        const dataWithAverageCollection = collection(db, "data_with_average");
        await addDoc(dataWithAverageCollection, {
          evaluateeName: averageData.evaluateeName,
          averageScore: averageData.averageScore,
          evaluateeCountry: averageData.evaluateeCountry,

          timestamp: new Date(),
        });
        setModalVisible(false);
        setAverageData(null);
      } catch (error) {
        console.error("Error saving data to Firebase: ", error);
      }
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setAverageData(null); 
  };

  const paginatedApplicants = sortApplicantsByNameThenPoints(filteredApplicants).slice((currentPage - 1) * pageSize, currentPage * pageSize);


  return (
    <div id="wrapper" className={styles.wrapper}>
        {showGuide && <AdminGuide onClose={() => setShowGuide(false)} />}
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
          <Link href="./ApplicantAverage">
            <Button type="primary">View applicant's Average </Button>
          </Link>
          {/* ApplicantAverage */}
          {selectedCountry && (
            <Button onClick={clearFilter}>Clear Filter</Button>
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
                  style={{ cursor: "pointer", color: "blue" }}
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
        <p>No applicants found</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Select</th>
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
                  <td>
                    <Checkbox
                      checked={!!selectedRows[applicant.id]}
                      onChange={(e) =>
                        handleCheckboxChange(applicant.id, e.target.checked)
                      }
                    />
                  </td>
                  <td>{applicant.evaluator.name}</td>
                  <td>{applicant.evaluator.country}</td>

                  <td
                    onClick={() => handleNameClick(applicant)}
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {applicant.evaluatee.name}
                  </td>


                  <td>{applicant.evaluatee.country}</td>
                  <td>
                    <ul>
                      {Object.entries(applicant.scores).map(
                        ([criterion, score]) => (
                          <li key={criterion}>
                            {criterion}: {score}
                          </li>
                        )
                      )}
                    </ul>
                  </td>
                  <td>{applicant.results.totalPoints}</td>
                  <td>{applicant.results.percentage.toFixed(2)}%</td>
                  <td>{applicant.evaluator.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Drawer
    title="Applicant Details"
    placement="right"
    onClose={handleDrawerClose}
    visible={drawerVisible}
    width={720}
  >
    {drawerContent ? (
      <div style={{ padding: '20px', lineHeight: '1.6' }}>
        {drawerContent.map((applicant, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            {Object.keys(applicant).map((key) => (
              <div key={key} style={{ marginBottom: '10px' }}>
                <strong>{key.replace(/_/g, ' ').replace(/\\n/g, ' ').trim()}:</strong>
                {key === 'Supporting Documents\nPlease upload a copy of your resume (pdf format)' ? (
                  <a href={applicant[key]} target="_blank" rel="noopener noreferrer">
                    {applicant[key]}
                  </a>
                ) : (
                  <span style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                    {applicant[key]}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    ) : (
      <p>No details available</p>
    )}
  </Drawer>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredApplicants.length}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={[10, 20, 50, 100]}
            style={{ marginTop: 16, textAlign: "center" }}
          />
        </>
      )}
      <Modal
        title="Average Scores"
        visible={modalVisible}
        onOk={handleSave}
        onCancel={handleModalClose}
        okText="Save"
        cancelText="Close"
      >
        <pre>{modalContent}</pre>
      </Modal>
    </div>
  );
};

export default Result;
