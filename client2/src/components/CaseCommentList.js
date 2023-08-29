import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';

const CaseCommentList = ({ caseId }) => {
    const [cases, setCaseComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all bids from the API
        axios.get(`/api/case-comments/case/${caseId}`, {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
          .then(response => {
            setCaseComments(response.data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching bids:', error);
          });
      }, []);

    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : (
                <div>
                    <ul>
                        {cases.map((caseComment) => (
                            <div key={caseComment.case_comment_id}>
                                <p>{caseComment.case_comment_dtlc}</p>
                                <p>{caseComment.case_comment_message}</p>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// Export component
export default CaseCommentList;