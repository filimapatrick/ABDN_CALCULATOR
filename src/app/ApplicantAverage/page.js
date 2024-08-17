"use client";

import React, { useState, useEffect } from "react";
import { Button, Drawer, Space, Input, Pagination, Watermark } from "antd"; // Import Watermark
import styles from "../styles/SortableTable.module.css";
import { db } from "../Services/auth";
import { collection, getDocs } from "firebase/firestore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ApplicantAverage = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantsCollection = collection(db, "data_with_average");
        const applicantsSnapshot = await getDocs(applicantsCollection);
        const applicantsData = applicantsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApplicants(applicantsData);
        setFilteredApplicants(applicantsData);

        const countriesData = applicantsSnapshot.docs.map(
          (doc) => doc.data().evaluateeCountry
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
        applicant.evaluateeCountry === country &&
        applicant.evaluateeName
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
        applicant.evaluateeName.toLowerCase().includes(query.toLowerCase()) &&
        (selectedCountry
          ? applicant.evaluateeCountry === selectedCountry
          : true)
    );
    setFilteredApplicants(filtered);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setSelectedCountry("");
    setFilteredApplicants(
      applicants.filter((applicant) =>
        applicant.evaluateeName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
    setCurrentPage(1);
  };

  // Calculate paginated applicants based on the current page and page size
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedApplicants = filteredApplicants.slice(startIndex, endIndex);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const exportAsPDF = () => {
    const input = document.getElementById("wrapper");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("applicants.pdf");
    });
  };

  return (
    <Watermark content="ABDN" font={{ fontSize: 54 }}>
      <div className="applicant-average">
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

              <Button type="primary" onClick={exportAsPDF}>
                Export as PDF
              </Button>

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
                    <th>Serial Number</th>
                    <th>Evaluatee Name</th>
                    <th>Evaluatee Country</th>
                    <th>Average</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedApplicants.map((applicant, index) => (
                    <tr key={applicant.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{applicant.evaluateeName}</td>
                      <td>{applicant.evaluateeCountry}</td>
                      <td>{applicant.averageScore}</td>
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
                style={{ marginTop: 16, textAlign: "center" }}
              />
            </>
          )}
        </div>
      </div>
    </Watermark>
  );
};

export default ApplicantAverage;
