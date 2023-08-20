import React from "react";

const CaseStatusButtons = ({ caseID, caseStatus }) => {
    const handleStatusChange = (newStatus) => {
        // TODO: Implement logic to update case status in database
    };

    return (
        <div className="btn-group" role="group" aria-label="Case Status Buttons">
            <button type="button" className="btn btn-primary" onClick={() => handleStatusChange("Start Work")}>Start Work</button>
            <button type="button" className="btn btn-warning" onClick={() => handleStatusChange("On Hold")}>On Hold</button>
            <button type="button" className="btn btn-success" onClick={() => handleStatusChange("Done")}>Done</button>
        </div>
    );
};

export default CaseStatusButtons;