import axios from "axios";
import { useState, useEffect } from "react";
import AdviserRating from "./AdviserRating";
import { Modal, Button } from "react-bootstrap";

const AdviserDetailsModal = ({adviserId}) => {
    const [showModal, setShowModal] = useState(false);
    const [adviserData, setAdviserData] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        // Fetch bid count from the API for the specific bid_case_id
        axios.get(`http://localhost:3005/api/advisers/${adviserId}`, {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
            .then(response => {
                setAdviserData(response.data[0]);
            })
            .catch(error => {
                console.error('Error fetching adviser:', error);
            });
    }, [showModal, adviserId]);

    return (
        <div>
            <Button variant="outline-primary" onClick={handleShow}>
                {adviserData ? (
                    <span>{adviserData.ad_firstname} {adviserData.ad_lastname}</span>
                ) : (
                    'Loading adviser data...'
                )}
            </Button>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Adviser Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {adviserData ? (
                        <div>
                            <p><strong>Name:</strong> {adviserData.ad_firstname} {adviserData.ad_lastname}</p>
                            <p><strong>Rating:</strong> <AdviserRating adviserId={adviserData.ad_id} /></p>
                        </div>
                    ) : (
                        <p>Loading adviser data...</p>
                    )}
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

// Export the component
export default AdviserDetailsModal;
