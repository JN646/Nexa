import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Make sure you have the Bootstrap components imported
import axios from "axios";

const BidForm = ({ caseId }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const [formData, setFormData] = useState({
    bid_case_id: caseId,
    bid_pp_id: "",
    bid_ad_id: "",
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
            .post("http://localhost:3005/api/bids/create", formData, {
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

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Place Bid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          <Form onSubmit={handleSubmit} className="form">
            <Form.Group controlId="bidPrice">
              <Form.Label>Case ID</Form.Label>
              <Form.Control
                type="number"
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
              <Form.Label>AD ID</Form.Label>
              <Form.Control
                type="number"
                name="bid_ad_id"
                onChange={handleChange}
                value={formData.bid_ad_id}
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
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit Bid
            </Button>
          </Form>
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

export default BidForm;
