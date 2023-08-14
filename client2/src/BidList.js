import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
          <tr>
            <th>Bid ID</th>
            <th>Case ID</th>
            <th>Paraplanner</th>
            <th>Adviser</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Accept</th>
          </tr>
        </thead>
        <tbody>
          {bids.map(bid => (
            <tr key={bid.bid_id}>
              <td>{bid.bid_id}</td>
              <td>{bid.bid_case_id}</td>
              <td>{bid.pp_firstname} {bid.pp_lastname}</td>
              <td>{bid.ad_firstname} {bid.ad_lastname}</td>
              <td>£{bid.bid_price}</td>
                <td style={{color: bid.bid_status === 'Accepted' ? 'green' : 'black'}}>{bid.bid_status === 'Unassigned' ? '' : bid.bid_status}</td>
                <td>{new Date(bid.bid_created_at).toLocaleDateString('en-GB')}</td>
                <td>
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
