import React, { useState, useEffect } from "react";
import axios from "axios";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const CaseStatusButtons = ({ caseID }) => {
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    axios
      .get(`/api/cases/${caseID}`, {
        headers: {
          "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
        },
      })
      .then((response) => {
        setCurrentStatus(response.data.status);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [caseID]);

    const handleStatusChange = (newStatus) => {
      axios
        .put(
          `/api/cases/${caseID}/status`,
          { status: newStatus },
          {
            headers: {
              "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setCurrentStatus(newStatus);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    return (
      <ButtonGroup
        variant="contained"
        aria-label="Case Status Buttons"
        sx={{ boxShadow: "none" }} // Add this line to remove the drop shadow
      >
        <Button
          color="primary"
          onClick={() => handleStatusChange("Working")}
          disabled={currentStatus === "Working" || currentStatus === "Accepted"}
        >
          Working
        </Button>
        <Button
          color="warning"
          onClick={() => handleStatusChange("Hold")}
          disabled={currentStatus === "Hold" || currentStatus === "Accepted"}
        >
          Hold
        </Button>
        <Button
          color="success"
          onClick={() => handleStatusChange("Done")}
          disabled={currentStatus === "Done" || currentStatus === "Accepted"}
        >
          Done
        </Button>
      </ButtonGroup>
    );
  };

  // Export the component
  export default CaseStatusButtons;
