import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BidCount = ({ bidCaseId }) => {
    const [bidCount, setBidCount] = useState(0);

    useEffect(() => {
        // Fetch bid count from the API for the specific bid_case_id
        axios.get(`http://localhost:3005/api/bids/count/${bidCaseId}`, {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
            .then(response => {
                setBidCount(response.data[0].bid_count);
            })
            .catch(error => {
                console.error('Error fetching bid count:', error);
            });
    }, [bidCaseId]);

    return (
        <span>
            {bidCount}
        </span>
    );
};

export default BidCount;
