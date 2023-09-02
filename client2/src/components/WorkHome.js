import { useState } from "react";
import { Button } from "react-bootstrap";
import AdviserDetails from "./AdviserDetails";
import CaseInfo from "./CaseInfo";
import CaseStatusButtons from "./CaseStatusButtons";
import AuditCaseList from "./AuditCaseList";
import CaseCommentList from "./CaseCommentList";
import CaseCommentControl from "./CaseCommentControl";
import { Modal, Box } from "@mui/material";

const WorkHome = ({ AdviserID, CaseID }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Work On
      </Button>
      <Modal
          open={showModal}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "90%",
            margin: "auto",
          }}
        >
        <Box p={2} sx={{ overflowY: "scroll", maxHeight: "90vh", backgroundColor: "#f5f5f5" }}>
          <div className="row">
            <div className="col-sm-3 col-md-3 col-sm-12 border">

              <div className="row">
                <h4>Adviser Details</h4>
                <AdviserDetails adviserId={AdviserID} />
              </div>

              <div className="row">
                <h4>Case Info</h4>
                <CaseInfo caseID={CaseID} />
              </div>
            </div>
            <div className="col-sm-7 col-md-7 col-sm-12 border">
              <div className="row">
                <h4>Case Workspace</h4>
                <CaseStatusButtons caseID={CaseID} />
              </div>

              <div className="row">
                <h4>Case Comments</h4>
                <CaseCommentList caseId={CaseID} />
                <CaseCommentControl CaseId={CaseID} Attach="Paraplanner" AttachId="1" />
              </div>
            </div>
            <div className="col-sm-2 col-md-2 col-sm-12 border">
              <div className="row">
                <h4>History</h4>
                <AuditCaseList caseId={CaseID} />
              </div>
            </div>
          </div>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

// Export the component.
export default WorkHome;
