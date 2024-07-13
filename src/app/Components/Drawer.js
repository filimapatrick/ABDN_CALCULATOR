'use client'
import React, { useState, useEffect } from 'react';
import { Button, Drawer, Space } from 'antd';
import { db } from '../Services/auth';
import { collection, getDocs } from "firebase/firestore";


const App = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantsCollection = collection(db, 'applicants');
        const applicantsSnapshot = await getDocs(applicantsCollection);
        const applicantsData = applicantsSnapshot.docs.map(doc => doc.data().evaluatee.country);
        const uniqueCountries = [...new Set(applicantsData)];
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

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer}>
          Filter by Country
        </Button>
      </Space>
      <Drawer
        title="Basic Drawer"
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
                onClick={() => {
                  console.log(country);
                }} 
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
    </>
  );
};

export default App;
