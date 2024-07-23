'use client'
import React, { createContext, useContext, useState } from 'react';

const DetailContext = createContext();

export const DetailProvider = ({ children, data }) => {
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  return (
    <DetailContext.Provider value={{ data, selectedApplicant, setSelectedApplicant }}>
      {children}
    </DetailContext.Provider>
  );
};

export const useDetailContext = () => {
  return useContext(DetailContext);
};
