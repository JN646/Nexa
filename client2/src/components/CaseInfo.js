import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";

const CaseInfo = ({ caseID }) => {
  const [cases, setCases] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/cases/${caseID}`, {
          headers: {
            "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
          },
        });
        setCases(response.data[0]);
      } catch (error) {
        console.error("Error fetching case detail:", error);
        setError(error);
      }
    };
    fetchData();
  }, [caseID]);

  if (error) {
    return <div>Error fetching case detail: {error.message}</div>;
  }

  return (
    <div>
      {cases ? (
        <div>
          <Typography variant="body1">
            {cases.case_type}
          </Typography>
          <Typography variant="body1">
            <span className={`status ${cases.case_bid_status}`}>
              {cases.case_bid_status}
            </span>
          </Typography>
          <Typography variant="body1">
            {new Date(cases.case_due_date).toLocaleDateString()}
          </Typography>
          <hr />
          <Typography variant="body1">
            <strong>Notes:</strong>
          </Typography>
          <div>{cases.case_notes}</div>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

// Export the component
export default CaseInfo;
