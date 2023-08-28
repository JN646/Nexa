import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';

const ParaplpannerCaseList = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/cases/paraplanner/done/1', {
                    headers: {
                        'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
                    }
                });
                setCases(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.log('No cases found');
                    setLoading(false);
                } else {
                    console.error('Error fetching cases:', error);
                }
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : cases.length ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Adviser Name</TableCell>
                                <TableCell>Bid Price</TableCell>
                                <TableCell>Case Created</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cases.map(({ case_id, case_type, case_ad_id, ad_firstname, ad_lastname, case_created_at, case_due_date, case_bid_status, bid_price }) => (
                                <TableRow key={case_id}>
                                    <TableCell className='text-center'>{case_id}</TableCell>
                                    <TableCell>{case_type}</TableCell>
                                    <TableCell>{`${ad_firstname} ${ad_lastname}`}</TableCell>
                                    <TableCell className='text-center'>£{bid_price}</TableCell>
                                    <TableCell className='text-center'>{new Date(case_created_at).toLocaleDateString('en-GB')}</TableCell>
                                    <TableCell className={`text-center ${new Date(case_due_date) < new Date() ? 'text-danger' : ''}`}>
                                        {case_due_date ? new Date(case_due_date).toLocaleDateString('en-GB') : ''}
                                    </TableCell>
                                    <TableCell className='text-center'>{case_bid_status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <p className='alert alert-info text-center'>No cases found.</p>
            )}
        </div>
    );
};

export default ParaplpannerCaseList;
