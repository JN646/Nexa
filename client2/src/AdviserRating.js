import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdviserRating = ({ adviserID }) => {
    const [adviserRating, setAdviserRating] = useState(0);

    useEffect(() => {
        // Fetch bid count from the API for the specific bid_case_id
        axios.get(`http://localhost:3005/api/advisers/star-rating/${adviserID}`, {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
            .then(response => {
                setAdviserRating(response.data[0].rating);
            })
            .catch(error => {
                console.error('Error fetching bid count:', error);
            });
    }, [adviserID]);

    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < adviserRating) {
            stars.push(<i key={i} className="fa-solid fa-star"></i>);
        } else {
            stars.push(<i key={i} className="fa-regular fa-star"></i>);
        }
    }

    return (
        <span>
            {stars}
        </span>
    );
};

export default AdviserRating;
