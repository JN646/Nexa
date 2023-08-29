import React, { useState } from "react";
import CaseCreateForm from "../components/CaseCreateForm"; // Adjust the import path as needed
import BidList from "../components/BidList";
import { Container, Typography, Button, Paper } from "@mui/material";

// Import the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import Datatables
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-dt/js/dataTables.dataTables.min.js";

// Import font-awesome
import "font-awesome/css/font-awesome.min.css";

// Import the Bootstrap components
import Modal from "react-bootstrap/Modal";

function Adviser() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Placed Bids
        </Typography>
        <Button variant="contained" onClick={handleShow} sx={{ mb: 2 }}>
          Create a Case
        </Button>
        <BidList />
      </Paper>

      {/* Create a case modal */}
      <Modal open={showModal} onClose={handleClose}>
        <CaseCreateForm />
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </Modal>
    </Container>
  );
}

export default Adviser;
