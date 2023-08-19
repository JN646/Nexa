import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import AdviserDetails from "./AdviserDetails";
import CaseInfo from "./CaseInfo";

const WorkHome = ({AdviserID, CaseID}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Work On
      </Button>
    <Modal id="workhubModal" size="xl" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>WorkHub</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="row">
              <div className="col-md-3 col-sm-12 border">
                <h4>Adviser Details</h4>
                <AdviserDetails adviserId={AdviserID} />
              </div>
              <div className="col-md-6 col-sm-12 border">
                <h4>Case Workspace</h4>
              </div>
              <div className="col-md-3 col-sm-12 border">
                <h4>Case Info</h4>
                <CaseInfo caseID={CaseID} />
              </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkHome;
