import React, { useState } from 'react';
import CaseList from './CaseList'; // Adjust the import path as needed
import CaseCreateForm from './CaseCreateForm'; // Adjust the import path as needed
import BidList from './BidList';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

// Import the Bootstrap components
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function App() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Nexa</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link onClick={handleShow}>Create a Case</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className='container-fluid'>
        <h1>Cases</h1>
        <CaseList />
      </div>
      <div className='container-fluid'>
        <hr />
        <h1>Bids</h1>
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

export default App;