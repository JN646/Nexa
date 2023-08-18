import React from "react";
import AdviserDetails from "./AdviserDetails";

const WorkHome = () => {
    return (
        <div>
            <h1>Work Home</h1>
            <p>Work Home page content goes here.</p>

            <div className="row">
                <div className="col-2 border">
                    <h2>Adviser Details</h2>
                    <AdviserDetails adviserId={1} />
                </div>
                <div className="col-8 border">
                    <h2>Case Workspace</h2>
                </div>
                <div className="col-2 border">
                    <h2>Case Info</h2>
                </div>
            </div>
        </div>
    );
};

export default WorkHome;