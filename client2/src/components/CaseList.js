import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CaseModal from './CaseModal';
import BidCount from './BidCount';
import AdviserDetailsModal from './AdviserDetailsModal';
import CircularProgress from '@mui/material/CircularProgress';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Paper } from '@mui/material';

const CaseList = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('due_date');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedCases = cases.sort((a, b) => {
        const isAsc = order === 'asc';
        if (orderBy === 'case_id') {
            return isAsc ? a.case_id - b.case_id : b.case_id - a.case_id;
        } else if (orderBy === 'case_type') {
            return isAsc ? a.case_type.localeCompare(b.case_type) : b.case_type.localeCompare(a.case_type);
        } else if (orderBy === 'ad_firstname') {
            return isAsc ? a.ad_firstname.localeCompare(b.ad_firstname) : b.ad_firstname.localeCompare(a.ad_firstname);
        } else if (orderBy === 'case_created_at') {
            return isAsc ? new Date(a.case_created_at) - new Date(b.case_created_at) : new Date(b.case_created_at) - new Date(a.case_created_at);
        } else if (orderBy === 'case_due_date') {
            return isAsc ? new Date(a.case_due_date) - new Date(b.case_due_date) : new Date(b.case_due_date) - new Date(a.case_due_date);
        } else if (orderBy === 'case_bid_status') {
            return isAsc ? a.case_bid_status.localeCompare(b.case_bid_status) : b.case_bid_status.localeCompare(a.case_bid_status);
        } else {
            return 0;
        }
    });

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedCases.length - page * rowsPerPage);

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'case_id'}
                                        direction={orderBy === 'case_id' ? order : 'asc'}
                                        onClick={() => handleSort('case_id')}
                                    >
                                        ID
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'case_type'}
                                        direction={orderBy === 'case_type' ? order : 'asc'}
                                        onClick={() => handleSort('case_type')}
                                    >
                                        Type
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'ad_firstname'}
                                        direction={orderBy === 'ad_firstname' ? order : 'asc'}
                                        onClick={() => handleSort('ad_firstname')}
                                    >
                                        Adviser Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'case_created_at'}
                                        direction={orderBy === 'case_created_at' ? order : 'asc'}
                                        onClick={() => handleSort('case_created_at')}
                                    >
                                        Case Created
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'case_due_date'}
                                        direction={orderBy === 'case_due_date' ? order : 'asc'}
                                        onClick={() => handleSort('case_due_date')}
                                    >
                                        Due Date
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'case_bid_status'}
                                        direction={orderBy === 'case_bid_status' ? order : 'asc'}
                                        onClick={() => handleSort('case_bid_status')}
                                    >
                                        Status
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Bids</TableCell>
                                <TableCell>Info</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ case_id, case_type, ad_firstname, ad_lastname, case_created_at, case_due_date, case_bid_status, case_ad_id }) => (
                                <TableRow key={case_id}>
                                    <TableCell className='text-center'>{case_id}</TableCell>
                                    <TableCell>{case_type}</TableCell>
                                    <TableCell className='text-center'><AdviserDetailsModal adviserId={case_ad_id} /></TableCell>
                                    <TableCell className='text-center'>{new Date(case_created_at).toLocaleDateString('en-GB')}</TableCell>
                                    <TableCell className='text-center'>{case_due_date ? new Date(case_due_date).toLocaleDateString('en-GB') : ''}</TableCell>
                                    <TableCell className='text-center'>{case_bid_status}</TableCell>
                                    <TableCell className='text-center'><BidCount bidCaseId={case_id} /></TableCell>
                                    <TableCell className='text-center'>
                                        <CaseModal caseId={case_id} />
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={8} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={sortedCases.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </TableContainer>
            )}
        </div>
    );
};

export default CaseList;
