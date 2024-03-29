import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Container } from 'react-bootstrap';

function TopNavbar() {
  return (
    <Navbar bg="light" expand="lg" className='mb-4'>
      <Container fluid>
        <Navbar.Brand href="#">ParaplannerNexa</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/paraplanner">Paraplanner</Nav.Link>
            <Nav.Link href="/adviser">Adviser</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// Exporting the component
export default TopNavbar;