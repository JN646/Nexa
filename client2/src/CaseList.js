import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CaseModal from './CaseModal';

const CaseList = () => {
    const [cases, setCases] = useState([]);

    useEffect(() => {
        // Fetch cases from the API
        axios.get('http://localhost:3005/api/cases/unassigned', {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
            .then(response => {
                setCases(response.data);
            })
            .catch(error => {
                console.error('Error fetching cases:', error);
            });
    }, []);
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Adviser Name</th>
                        <th>Case Created</th>
                        <th>Due Date</th>
                        <th>Info</th>
                        <th>Bid</th>
                        {/* Add other case properties you want to display */}
                    </tr>
                </thead>
                <tbody>
                    {cases.map(caseItem => (
                        <tr key={caseItem.case_id}>
                            <td>{caseItem.case_id}</td>
                            <td>{caseItem.case_type}</td>
                            <td>{caseItem.ad_firstname} {caseItem.ad_lastname}</td>
                            <td>{new Date(caseItem.case_created_at).toLocaleDateString('en-GB')}</td>
                            {caseItem.case_due_date ? (
                                <td>{new Date(caseItem.case_due_date).toLocaleDateString('en-GB')}</td>
                            ) : (
                                <td></td>
                            )}
                            <td>
                                <CaseModal caseId={caseItem.case_id} />
                            </td>
                            <td>Bid</td>
                            {/* Add other case properties you want to display */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CaseList;
