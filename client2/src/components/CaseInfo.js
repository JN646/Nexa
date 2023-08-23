import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const CaseInfo = ({caseID}) => {
    const [cases, setCases] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3005/api/cases/${caseID}`, {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
        .then(response => {
            setCases(response.data[0]);
        })
        .catch(error => {
            console.error('Error fetching case detail:', error);
            setError(error);
        });
    }, [caseID]);

    if (error) {
        return <div>Error fetching case detail: {error.message}</div>;
    }

    return (
        <div>
            {cases ? (
                <div>
                    <p><strong>Type:</strong> {cases.case_type}</p>
                    <p><strong>Status:</strong> {cases.case_bid_status}</p>
                    <p><strong>Due Date:</strong> {new Date(cases.case_due_date).toLocaleDateString()}</p>
                    <p><strong>Notes:</strong></p> 
                    <div>{cases.case_notes}</div>
                </div>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
};

// Export the component
export default CaseInfo;