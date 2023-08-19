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

    const handlePhoneClick = () => {
        window.location.href = `tel:${adviserData.ad_tel}`;
    }

    const handleEmailClick = () => {
        window.location.href = `mailto:${adviserData.ad_email}`;
    }

    return (
        <div>
            {adviserData ? (
                <div>
                    <p><strong>Name:</strong> {adviserData.ad_firstname} {adviserData.ad_lastname}</p>
                    <p><strong>Rating:</strong> <AdviserRating adviserId={adviserData.ad_id} /></p>
                    <p><strong>Phone:</strong> <a href={`tel:${adviserData.ad_tel}`} onClick={handlePhoneClick}>{adviserData.ad_tel}</a></p>
                    <p><strong>Email:</strong> <a href={`mailto:${adviserData.ad_email}`} onClick={handleEmailClick}>{adviserData.ad_email}</a></p>
                </div>
            ) : (
                <p>Loading adviser data...</p>
            )}
        </div>
    );
}

// Export the component
export default AdviserDetails;