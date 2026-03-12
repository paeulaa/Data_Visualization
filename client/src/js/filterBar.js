// FilterBar.js
import React from 'react';
import '../css/filterBar.css';

function FilterBar({ selectedDegree, setSelectedDegree, selectedMajor, setSelectedMajor, selectedGender, setSelectedGender }) {
    return (
        // <div className="style">
        <div className="filter-bar">
            <label>
                Degree:
                <select value={selectedDegree} onChange={(e) => setSelectedDegree(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                </select>
            </label>
            <label>
                Major:
                <select value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Economics">Economics</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Finance">Finance</option>
                    <option value="International_Economic_Relations">International Economic Relations</option>
                    <option value="Economics_and_Business">Economics and Business</option>
                    <option value="Accounting_and_Analysis">Accounting and Analysis</option>
                    <option value="Business_Management">Business Management</option>
                    <option value="Management_in_Tourism">Management in Tourism</option>
                    <option value="Public_Administration">Public Administration</option>
                    <option value="Geography_Technologies_and_Entrepreneurship">Geography, Technologies and Entrepreneurship</option>
                </select>
            </label>
            <label>
                Gender:
                <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </label>
        </div>
        // </div >
    );
}

export default FilterBar;
