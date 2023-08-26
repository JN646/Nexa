import React, { useState } from 'react';
import CaseCreateForm from '../components/CaseCreateForm'; // Adjust the import path as needed
import BidList from '../components/BidList';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

// Import font-awesome
import 'font-awesome/css/font-awesome.min.css';

// Import the Bootstrap components
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
 
function Adviser() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className="App">
      <div className='container-fluid'>
        <h1>Placed Bids</h1>
        <Nav.Link onClick={handleShow}>
          Create a Case
        </Nav.Link>
        <p>Choose a paraplanner to complete your case.</p>
        <BidList />
      </div>

      {/* Create a case modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CaseCreateForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
 
export default Adviser;