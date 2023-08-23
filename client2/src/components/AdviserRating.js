import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';

const AdviserRating = ({ adviserId }) => {
    const [adviserRating, setAdviserRating] = useState(0);

    useEffect(() => {
        // Fetch bid count from the API for the specific bid_case_id
        axios.get(`http://localhost:3005/api/advisers/star-rating/${adviserId}`, {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
            .then(response => {
                setAdviserRating(response.data[0].rating);
            })
            .catch(error => {
                console.error('Error fetching rating:', error);
            });
    }, [adviserId]);
    
    return (
        <span>
            <Rating name="read-only" value={adviserRating} readOnly />
        </span>
    );
};

export default AdviserRating;
