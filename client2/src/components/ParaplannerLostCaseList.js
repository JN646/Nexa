import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import AdviserDetailsModal from './AdviserDetailsModal';

const ParaplannerCaseList = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/bids/paraplanner/rejected/1', {
                    headers: {
                        'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
                    }
                });
                setCases(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.log('No cases found');
                } else {
                    console.error('Error fetching cases:', error);
                }
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Pass an empty dependency array to run the effect only once

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Case ID</TableCell>
                                <TableCell>Paraplanner</TableCell>
                                <TableCell>Adviser</TableCell>
                                <TableCell>Bid Price</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cases.map(({ bid_id, bid_case_id, pp_firstname, pp_lastname, bid_ad_id, bid_price, bid_status, bid_created_at }) => (
                                <TableRow key={bid_id}>
                                    <TableCell className='text-center'>{bid_id}</TableCell>
                                    <TableCell>{bid_case_id}</TableCell>
                                    <TableCell>{pp_firstname} {pp_lastname}</TableCell>
                                    <TableCell>
                                        <AdviserDetailsModal adviserId={bid_ad_id} />
                                    </TableCell>
                                    <TableCell>{bid_price}</TableCell>
                                    <TableCell>{bid_status}</TableCell>
                                    <TableCell>{new Date(bid_created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default ParaplannerCaseList;
