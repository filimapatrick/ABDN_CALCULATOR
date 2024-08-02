"use client";

import React, { useState, useEffect } from 'react';
import { Button, Drawer, Space, List } from 'antd';
import { useDetailContext } from '../Steps/DetailContext'; // Adjust the path as per your project structure
import styles from '../styles/Calculator.module.css';

const App = ({ label }) => {
  const { data, setSelectedApplicant } = useDetailContext(); // Access setSelectedApplicant
  const [open, setOpen] = useState(false); // Initialize open as false initially
  const [size, setSize] = useState('default');
  const [isClient, setIsClient] = useState(false); // Track if on client
  const [selectedCountry, setSelectedCountry] = useState(null); // State to track selected country
  const [focusedCountry, setFocusedCountry] = useState(null); // State to track focused country
  const [focusedApplicant, setFocusedApplicant] = useState(null); // State to track focused applicant
  const [secondDrawerOpen, setSecondDrawerOpen] = useState(false); // Track if the second drawer is open

  useEffect(() => {
    setIsClient(true); // Set isClient to true on client-side mount
  }, []);

  const showDefaultDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSecondDrawerOpen(false); // Close both drawers
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setFocusedCountry(country);
    setSecondDrawerOpen(true); // Open the second drawer when a country is clicked
  };

  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant);
    setFocusedApplicant(applicant);
    setSecondDrawerOpen(false); // Close the second drawer when an applicant is clicked
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
      {/* Render the first Drawer conditionally on the client */}
      {open && (
        <Drawer
          title={'Applicants country'}
          placement="left"
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
                <List.Item
                  key={country}
                  className={`${styles.country_item} ${focusedCountry === country ? styles.focused : ''}`}
                  onClick={() => handleCountryClick(country)}
                  tabIndex={0} // Make it focusable
                >
                  {country}
                </List.Item>
              )}
            />
          </Space>
        </Drawer>
      )}
      {/* Render the second Drawer conditionally on the client */}
      {secondDrawerOpen && (
        <Drawer
          title="Applicants"
          placement="right"
          size={size}
          onClose={() => setSecondDrawerOpen(false)}
          visible={secondDrawerOpen}
          footer={
            <Space>
              <Button onClick={() => setSecondDrawerOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={() => setSecondDrawerOpen(false)}>
                OK
              </Button>
            </Space>
          }
        >
          <Space direction="vertical">
            {/* Display filtered first name and last name based on selected country */}
            {filteredData.map((item, index) => (
              <p
                key={index}
                onClick={() => handleApplicantClick(item)}
                className={`${styles.applicant_item} ${focusedApplicant === item ? styles.focused : ''}`}
                tabIndex={0} // Make it focusable
              >
                {index + 1}. {item['First Name']} {item['Last Name']}
              </p>
            ))}
          </Space>
        </Drawer>
      )}
    </>
  );
};

export default App;
