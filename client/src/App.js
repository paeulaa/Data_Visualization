import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './App.css';
import MainPage from './js/mainPage.js';
import FilterBar from './js/filterBar.js';
import ClusterDetails from './js/clusterDetails.js';

function App() {
  const [hierarchyData, setHierarchyData] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [selectedMajor, setSelectedMajor] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');

  //接取api -- fetch data
  useEffect(() => {
    fetch('/data/hierarchy_data.json')
      .then(response => response.json())
      .then(data => setHierarchyData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Router>
      <FilterBar
        selectedDegree={selectedDegree}
        setSelectedDegree={setSelectedDegree}
        selectedMajor={selectedMajor}
        setSelectedMajor={setSelectedMajor}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
      />
      <Routes>
        <Route path="/" element={
          <MainPage
            hierarchyData={hierarchyData}
            selectedDegree={selectedDegree}
            selectedMajor={selectedMajor}
            selectedGender={selectedGender}
          />} />
        <Route path="/details/:clusterName" element={
          <ClusterDetails
            hierarchyData={hierarchyData}
            selectedDegree={selectedDegree}
            selectedMajor={selectedMajor}
            selectedGender={selectedGender}
          />} />
      </Routes>
    </Router>
  );

}

export default App;