import React from 'react';
import CaseList from './CaseList'; // Adjust the import path as needed
import CaseCreateForm from './CaseCreateForm'; // Adjust the import path as needed

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Datatables
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-dt/js/dataTables.dataTables.min.js';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function App() {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Nexa</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">Create a Case</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className='container-fluid'>
        <h1>Cases</h1>
        <CaseList />
      </div>
      <div className='container-fluid'>
        <hr />
        <CaseCreateForm />
      </div>
    </div>
  );
}

export default App;