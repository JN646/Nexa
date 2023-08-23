import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParaplpannerCaseList = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3005/api/cases/paraplanner/done/1', {
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
            ) : cases.length ? (
                <table className="table">
                    <thead>
                        <tr className='text-center'>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Adviser Name</th>
                            <th>Bid Price</th>
                            <th>Case Created</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map(({ case_id, case_type, case_ad_id, ad_firstname, ad_lastname, case_created_at, case_due_date, case_bid_status, bid_price }) => (
                            <tr key={case_id}>
                                <td className='text-center'>{case_id}</td>
                                <td>{case_type}</td>
                                <td>{`${ad_firstname} ${ad_lastname}`}</td>
                                <td className='text-center'>£{bid_price}</td>
                                <td className='text-center'>{new Date(case_created_at).toLocaleDateString('en-GB')}</td>
                                <td className={`text-center ${new Date(case_due_date) < new Date() ? 'text-danger' : ''}`}>
                                    {case_due_date ? new Date(case_due_date).toLocaleDateString('en-GB') : ''}
                                </td>
                                <td className='text-center'>{case_bid_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className='alert alert-info text-center'>No cases found.</p>
            )}
        </div>
    );
};

export default ParaplpannerCaseList;
