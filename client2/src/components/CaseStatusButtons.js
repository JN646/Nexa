import React from "react";
import axios from "axios";

const CaseStatusButtons = ({ caseID }) => {
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
      >
        Working
      </button>
      <button
        type="button"
        className="btn btn-warning"
        onClick={() => handleStatusChange("Hold")}
      >
        Hold
      </button>
      <button
        type="button"
        className="btn btn-success"
        onClick={() => handleStatusChange("Done")}
      >
        Done
      </button>
    </div>
  );
};

// Export the component
export default CaseStatusButtons;
