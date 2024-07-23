'use client';
import React, { useState, useEffect } from 'react';
import { Button, Drawer, Space } from 'antd';
import { useDetailContext } from '../Steps/DetailContext'; // Adjust the path as per your project structure

const Detail = ({ label }) => {
  const { selectedApplicant } = useDetailContext(); // Get the selected applicant from context
  const [open, setOpen] = useState(false); // Initialize open as false initially
  const [size, setSize] = useState('large');
  const [isClient, setIsClient] = useState(false); // Track if on client

  useEffect(() => {
    setIsClient(true); // Set isClient to true on client-side mount
  }, []);

  const showDefaultDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  if (!isClient) {
    // Server-side rendering fallback, avoid rendering client-specific code
    return null;
  }

  const styles = {
    container: {
      padding: '20px',
      lineHeight: '1.6',
    },
    field: {
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#1890ff',
    },
    value: {
      backgroundColor: '#f5f5f5',
      padding: '10px',
      borderRadius: '5px',
    },
    link: {
      color: '#1890ff',
      textDecoration: 'underline',
    },
  };

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
          placement="right" // Adjust placement as needed
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
          
          {selectedApplicant ? (
            <div style={styles.container}>
              {Object.keys(selectedApplicant).map((key) => (
                <div key={key} style={styles.field}>
                  <span style={styles.label}>{key.replace(/_/g, ' ').replace(/\\n/g, ' ').trim()}:</span>
                  {key === 'Supporting Documents\nPlease upload a copy of your resume (pdf format)' ? (
                    <a href={selectedApplicant[key]} style={styles.link} target="_blank" rel="noopener noreferrer">
                      {selectedApplicant[key]}
                    </a>
                  ) : (
                    <span style={styles.value}>{selectedApplicant[key]}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No applicant selected</p>
          )}
        </Drawer>
      )}
    </>
  );
};

export default Detail;
