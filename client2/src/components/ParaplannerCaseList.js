import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WorkHome from './WorkHome';
import CircularProgress from '@mui/material/CircularProgress';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Paper } from '@mui/material';

const ParaplannerCaseList = () => {
    // const classes = useStyles();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('case_id');
    const [order, setOrder] = useState('asc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/cases/paraplanner/1', {
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

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrderBy(property);
        setOrder(isAsc ? 'desc' : 'asc');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedCases = cases.sort((a, b) => {
        const isAsc = order === 'asc';
        if (orderBy === 'ad_firstname') {
            return (a.ad_firstname + a.ad_lastname).localeCompare(b.ad_firstname + b.ad_lastname) * (isAsc ? 1 : -1);
        }
        return (a[orderBy] > b[orderBy] ? 1 : -1) * (isAsc ? 1 : -1);
    });

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedCases.length - page * rowsPerPage);

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : (
                <TableContainer>
                    <Table size='small' aria-label="paraplanner case list">
                        <TableHead>
                            <TableRow style={{textAlign: 'center'}}>
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
                                        active={orderBy === 'bid_price'}
                                        direction={orderBy === 'bid_price' ? order : 'asc'}
                                        onClick={() => handleSort('bid_price')}
                                    >
                                        Bid Price
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
                                <TableCell>Work On</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ case_id, case_type, case_ad_id, ad_firstname, ad_lastname, case_created_at, case_due_date, case_bid_status, bid_price }) => (
                                <TableRow key={case_id}>
                                    <TableCell>{case_id}</TableCell>
                                    <TableCell>{case_type}</TableCell>
                                    <TableCell>{`${ad_firstname} ${ad_lastname}`}</TableCell>
                                    <TableCell>£{bid_price}</TableCell>
                                    <TableCell>{new Date(case_created_at).toLocaleDateString('en-GB')}</TableCell>
                                    <TableCell className={`text-center ${new Date(case_due_date) < new Date() ? 'text-danger' : ''}`}>
                                        {case_due_date ? new Date(case_due_date).toLocaleDateString('en-GB') : ''}
                                    </TableCell>
                                    <TableCell>{case_bid_status}</TableCell>
                                    <TableCell>
                                        <WorkHome AdviserID={case_ad_id} CaseID={case_id} />
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
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            )}
        </div>
    );
};

export default ParaplannerCaseList;
