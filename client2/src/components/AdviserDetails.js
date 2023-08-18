import axios from "axios";
import { useState, useEffect } from "react";
import AdviserRating from "./AdviserRating";

const AdviserDetails = ({adviserId}) => {
    const [adviserData, setAdviserData] = useState(null);

    useEffect(() => {
        // Fetch bid count from the API for the specific bid_case_id
        axios.get(`http://localhost:3005/api/advisers/${adviserId}`, {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
            .then(response => {
                setAdviserData(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching adviser:', error);
            });
    }, [adviserId]);

    return (
        <div>
            {adviserData ? (
                <div>
                    <p><strong>Name:</strong> {adviserData.ad_firstname} {adviserData.ad_lastname}</p>
                    <p><strong>Rating:</strong> <AdviserRating adviserId={adviserData.ad_rating} /></p>
                    <p><strong>Phone:</strong> {adviserData.ad_tel}</p>
                    <p><strong>Email:</strong> {adviserData.ad_email}</p>
                </div>
            ) : (
                <p>Loading adviser data...</p>
            )}
        </div>
    );
}

// Export the component
export default AdviserDetails;