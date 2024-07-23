"use client"

import React, { useState, useEffect } from 'react';
import { Button, Drawer, Space, List } from 'antd';
import { useDetailContext } from '../Steps/DetailContext'; // Adjust the path as per your project structure
import styles from '../styles/Calculator.module.css'
const App = ({ label }) => {
  const { data, setSelectedApplicant } = useDetailContext(); // Access setSelectedApplicant
  const [open, setOpen] = useState(false); // Initialize open as false initially
  const [size, setSize] = useState('default');
  const [isClient, setIsClient] = useState(false); // Track if on client
  const [selectedCountry, setSelectedCountry] = useState(null); // State to track selected country

  useEffect(() => {
    setIsClient(true); // Set isClient to true on client-side mount
  }, []);

  const showDefaultDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
  };

  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant);
    setOpen(false); // Close the drawer when an applicant is clicked
  };

  if (!isClient) {
    // Server-side rendering fallback, avoid rendering client-specific code
    return null;
  }

  let filteredData = data;
  if (selectedCountry) {
    filteredData = data.filter(item => item['Country of residence'] === selectedCountry);
  }

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDefaultDrawer}>
          {label}
        </Button>
      </Space>
      {/* Render the Drawer conditionally on the client */}
      {open && (
        <Drawer
          title={`${size} Drawer`}
          placement="left" // Adjust placement as needed
          size={size}
          onClose={onClose}
          visible={open}
          footer={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" onClick={onClose}>
                OK
              </Button>
            </Space>
          }
        >
          <Space direction="vertical">
            {/* Display list of countries */}
            <List
              size="large"
              bordered
              dataSource={Array.from(new Set(data.map(item => item['Country of residence'])))} // Get unique countries
              renderItem={country => (
                <List.Item key={country} onClick={() => handleCountryClick(country)}>
                  {country}
                </List.Item>
              )}
            />
            {/* Display filtered first name and last name based on selected country */}
            {filteredData.map((item, index) => (
              <p key={index} onClick={() => handleApplicantClick(item)} className={styles.applicant_names}>
                {item['First Name']} {item['Last Name']}
              </p>
            ))}
          </Space>
        </Drawer>
      )}
    </>
  );
};

export default App;
