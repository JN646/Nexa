import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Make sure you have the Bootstrap components imported
import axios from "axios";

const BidForm = ({ caseId, adviserId }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [formData, setFormData] = useState({
    bid_case_id: caseId,
    bid_pp_id: "",
    bid_ad_id: adviserId,
    bid_price: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log("Name:", name + " Value:", value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Form data:", formData);

    axios
      .post("/api/bids/create", formData, {
        headers: {
          "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
        },
      })
      .then((response) => {
        console.log("Bid submitted:", response.data);

        // Reset form
        setFormData({
          bid_case_id: caseId,
          bid_pp_id: "",
          bid_ad_id: "",
          bid_price: "",
        });
        setErrorMessage("");
        
        setSuccessMessage("Bid created successfully!");
      })
      .catch((error) => {
        console.error("Error submitting bid:", error);

        if (error.response.data.errors) {
          setErrorMessage(error.response.data.errors[0].msg);
        } else {
          setErrorMessage(error.response.data.error);
        }
      });
  };
  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Place Bid
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Form onSubmit={handleSubmit} className="form">
          <Modal.Header closeButton>
            <Modal.Title>Place Bid</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && (
              <p style={{ color: "green" }}>{successMessage}</p>
            )}

            <Form.Group controlId="bidPrice">
              <p>Please enter your bid price below: </p>

              {/* <Form.Label>Case ID</Form.Label> */}
              <Form.Control
                type="hidden"
                value={caseId}
                name="bid_case_id"
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="bidPPId">
              <Form.Label>PP ID</Form.Label>
              <Form.Control
                type="number"
                name="bid_pp_id"
                onChange={handleChange}
                value={formData.bid_pp_id}
              />
            </Form.Group>
            <Form.Group controlId="bidADId">
              {/* <Form.Label>AD ID</Form.Label> */}
              <Form.Control
                type="hidden"
                name="bid_ad_id"
                onChange={handleChange}
                value={formData.bid_ad_id}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="bidPrice">
              <Form.Label>Bid Price</Form.Label>
              <Form.Control
                type="number"
                name="bid_price"
                min="30"
                onChange={handleChange}
                value={formData.bid_price}
                required
              />

            <p>Please note that once you have submitted your bid you will not be able to change it.</p>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Submit Bid
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

// Export the component as the default object
export default BidForm;
