import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CaseModal from './CaseModal';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const BidTable = () => {
  const [bids, setBids] = useState([]);
  const [filteredBids, setFilteredBids] = useState([]);
  const [sortField, setSortField] = useState('bid_id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterField, setFilterField] = useState('case_type');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    // Fetch all bids from the API
    axios.get(`/api/bids/all`, {
        headers: {
            'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
        }
    })
      .then(response => {
        setBids(response.data);
        setFilteredBids(response.data);
      })
      .catch(error => {
        console.error('Error fetching bids:', error);
      });
  }, []);

  useEffect(() => {
    // Sort the filtered bids based on the selected sort field and order
    const sortedBids = [...filteredBids].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
    setFilteredBids(sortedBids);
  }, [sortField, sortOrder]);

  useEffect(() => {
    // Filter the bids based on the selected filter field and value
    const filteredBids = bids.filter(bid => {
      if (filterValue === '') {
        return true;
      } else {
        return bid[filterField].toLowerCase().includes(filterValue.toLowerCase());
      }
    });
    setFilteredBids(filteredBids);
  }, [filterField, filterValue]);

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleFilterFieldChange = (event) => {
    setFilterField(event.target.value);
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sort-field-label">Sort Field</InputLabel>
        <Select
          labelId="sort-field-label"
          id="sort-field-select"
          value={sortField}
          onChange={handleSortFieldChange}
        >
          <MenuItem value="bid_id">Bid ID</MenuItem>
          <MenuItem value="bid_case_id">Case ID</MenuItem>
          <MenuItem value="case_type">Type</MenuItem>
          <MenuItem value="pp_lastname">Paraplanner</MenuItem>
          <MenuItem value="ad_lastname">Adviser</MenuItem>
          <MenuItem value="bid_price">Price</MenuItem>
          <MenuItem value="bid_status">Status</MenuItem>
          <MenuItem value="bid_created_at">Created At</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sort-order-label">Sort Order</InputLabel>
        <Select
          labelId="sort-order-label"
          id="sort-order-select"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="filter-field-label">Filter Field</InputLabel>
        <Select
          labelId="filter-field-label"
          id="filter-field-select"
          value={filterField}
          onChange={handleFilterFieldChange}
        >
          <MenuItem value="bid_id">Bid ID</MenuItem>
          <MenuItem value="bid_case_id">Case ID</MenuItem>
          <MenuItem value="case_type">Type</MenuItem>
          <MenuItem value="pp_lastname">Paraplanner</MenuItem>
          <MenuItem value="ad_lastname">Adviser</MenuItem>
          <MenuItem value="bid_price">Price</MenuItem>
          <MenuItem value="bid_status">Status</MenuItem>
          <MenuItem value="bid_created_at">Created At</MenuItem>
        </Select>
      </FormControl>
      <TextField
        sx={{ m: 1 }}
        id="filter-value"
        label="Filter Value"
        value={filterValue}
        onChange={handleFilterValueChange}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bid ID</TableCell>
              <TableCell>Case ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Paraplanner</TableCell>
              <TableCell>Adviser</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Accept</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBids.map(bid => (
              <TableRow key={bid.bid_id}>
                <TableCell>{bid.bid_id}</TableCell>
                <TableCell>{bid.bid_case_id}</TableCell>
                <TableCell>{bid.case_type}</TableCell>
                <TableCell>{bid.pp_firstname} {bid.pp_lastname}</TableCell>
                <TableCell>{bid.ad_firstname} {bid.ad_lastname}</TableCell>
                <TableCell>£{bid.bid_price}</TableCell>
                <TableCell style={{color: bid.bid_status === 'Accepted' ? 'green' : bid.bid_status === 'Rejected' ? 'red' : 'black'}}>{bid.bid_status === 'Unassigned' ? '' : bid.bid_status}</TableCell>
                <TableCell>{new Date(bid.bid_created_at).toLocaleDateString('en-GB')}</TableCell>
                <TableCell>
                  <CaseModal caseId={bid.bid_case_id} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={bid.bid_status === 'Accepted'}
                  >
                    Accept
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BidTable;
