import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CaseModal from './CaseModal';
import BidCount from './BidCount';
import AdviserDetailsModal from './AdviserDetailsModal';
import CircularProgress from '@mui/material/CircularProgress';

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
                <CircularProgress />
            ) : (
                <table className="table">
                    <thead>
                        <tr className='text-center'>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Adviser Name</th>
                            <th>Case Created</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Bids</th>
                            <th>Info</th>
                        </tr>
                    </thead>
                    <tbody className='align-middle'>
                        {cases.map(({ case_id, case_type, ad_firstname, ad_lastname, case_created_at, case_due_date, case_bid_status, case_ad_id }) => (
                            <tr key={case_id}>
                                <td className='text-center'>{case_id}</td>
                                <td>{case_type}</td>
                                <td className='text-center'><AdviserDetailsModal adviserId={case_ad_id} /></td>
                                <td className='text-center'>{new Date(case_created_at).toLocaleDateString('en-GB')}</td>
                                <td className='text-center'>{case_due_date ? new Date(case_due_date).toLocaleDateString('en-GB') : ''}</td>
                                <td className='text-center'>{case_bid_status}</td>
                                <td className='text-center'><BidCount bidCaseId={case_id} /></td>
                                <td className='text-center'>
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
