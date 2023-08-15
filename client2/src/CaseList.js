import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CaseModal from './CaseModal';
import BidCount from './BidCount';

const CaseList = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3005/api/cases/unassigned', {
                    headers: {
                        'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
                    }
                });
                setCases(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cases:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Adviser Name</th>
                            <th>Case Created</th>
                            <th>Due Date</th>
                            <th>Bids</th>
                            <th>Info</th>
                            {/* Add other case properties you want to display */}
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map(({ case_id, case_type, ad_firstname, ad_lastname, case_created_at, case_due_date }) => (
                            <tr key={case_id}>
                                <td>{case_id}</td>
                                <td>{case_type}</td>
                                <td>{`${ad_firstname} ${ad_lastname}`}</td>
                                <td>{new Date(case_created_at).toLocaleDateString('en-GB')}</td>
                                <td>{case_due_date ? new Date(case_due_date).toLocaleDateString('en-GB') : ''}</td>
                                <td><BidCount bidCaseId={case_id} /></td>
                                <td>
                                    <CaseModal caseId={case_id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CaseList;
