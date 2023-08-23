import React, { useState, useEffect } from "react";
import axios from "axios";

const CaseStatusButtons = ({ caseID }) => {
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:3005/api/cases/${caseID}`, {
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
          `http://localhost:3005/api/cases/${caseID}/status`,
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
      <div className="btn-group" role="group" aria-label="Case Status Buttons">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleStatusChange("Working")}
          disabled={currentStatus === "Working" || currentStatus === "Accepted"}
        >
          Working
        </button>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => handleStatusChange("Hold")}
          disabled={currentStatus === "Hold" || currentStatus === "Accepted"}
        >
          Hold
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => handleStatusChange("Done")}
          disabled={currentStatus === "Done" || currentStatus === "Accepted"}
        >
          Done
        </button>
      </div>
    );
  };

  // Export the component
  export default CaseStatusButtons;
