import React, { useState } from 'react';
import { parseCSV } from './utils/csvParser';
import { generateSecretSanta } from './utils/assignmentGenerator';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import './index.css'

const App = () => {
    const [currentEmployees, setCurrentEmployees] = useState([]);
    const [previousAssignments, setPreviousAssignments] = useState([]);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const handleFileUpload = (setter) => (file) => {
        parseCSV(file, (data, error) => {
            if (error) {
                setError('Error parsing CSV file.');
                return;
            }
            setter(data);
        });
    };

    const generateAssignments = () => {
        try {
            const assignments = generateSecretSanta(currentEmployees, previousAssignments);
            setResult(assignments);
            setError('');
        } catch (e) {
            setError(e.message);
        }
    };

    const downloadCSV = () => {
        const csv = Papa.unparse(result.map(item => ({
            Employee_Name: item.Employee_Name,
            Employee_EmailID: item.Employee_EmailID,
            Secret_Child_Name: item.Secret_Child_Name,
            Secret_Child_EmailID: item.Secret_Child_EmailID
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'secret_santa_assignments.csv');
    };

    return (
        <div className='container'>
            <h1 className='main_head'>Secret Santa Generator</h1>
            <div  className='container-fluid'>
            <div className='emp_csv'>
                <h3>Upload Current Employees CSV</h3>
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(setCurrentEmployees)(e.target.files[0])}
                />
            </div>
            <div className='emp_csv'>
                <h3>Upload Previous Assignments CSV</h3>
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(setPreviousAssignments)(e.target.files[0])}
                />
            </div>
            </div>
        <p className='btn'>
        <button className='generate-btn' onClick={generateAssignments}>Generate Assignments</button>
        </p>

            {error && <div className='error'>{error}</div>}
            {result && (
                <div className='result-section'>
                    <h3>Assignments Generated Successfully!</h3>
                    <button className='generate-btn' onClick={downloadCSV}>Download CSV</button>
                </div>
            )}
        </div>
    );
};

export default App;