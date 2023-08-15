import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CaseModal from './CaseModal';

const BidTable = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // Fetch all bids from the API
    axios.get(`http://localhost:3005/api/bids/all`, {
        headers: {
            'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
        }
    })
      .then(response => {
        setBids(response.data);
      })
      .catch(error => {
        console.error('Error fetching bids:', error);
      });
  }, []);

  return (
    <div>
      <table className="table">
        <thead>
          <tr className='text-center'>
            <th>Bid ID</th>
            <th>Case ID</th>
            <th>Type</th>
            <th>Paraplanner</th>
            <th>Adviser</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created At</th>
            <th>View</th>
            <th>Accept</th>
          </tr>
        </thead>
        <tbody>
          {bids.map(bid => (
            <tr key={bid.bid_id}>
              <td className='text-center'>{bid.bid_id}</td>
              <td className='text-center'>{bid.bid_case_id}</td>
              <td>{bid.case_type}</td>
              <td>{bid.pp_firstname} {bid.pp_lastname}</td>
              <td>{bid.ad_firstname} {bid.ad_lastname}</td>
              <td className='text-center'>£{bid.bid_price}</td>
                <td className='text-center' style={{color: bid.bid_status === 'Accepted' ? 'green' : bid.bid_status === 'Rejected' ? 'red' : 'black'}}>{bid.bid_status === 'Unassigned' ? '' : bid.bid_status}</td>
                <td className='text-center'>{new Date(bid.bid_created_at).toLocaleDateString('en-GB')}</td>
                <td className='text-center'>
                    <CaseModal caseId={bid.bid_case_id} />
                </td>
                <td className='text-center'>
                    <button className="btn btn-primary" disabled={bid.bid_status === 'Accepted'}>Accept</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BidTable;
