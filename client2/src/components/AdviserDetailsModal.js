import axios from "axios";
import { useState, useEffect } from "react";
import AdviserRating from "./AdviserRating";
import { Modal, Button } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import CircularProgress from '@mui/material/CircularProgress';

const AdviserDetailsModal = ({adviserId}) => {
    const [showModal, setShowModal] = useState(false);
    const [adviserData, setAdviserData] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    let initials = adviserData ? adviserData.ad_firstname.charAt(0) : '';

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
                    <Stack direction="row" spacing={2}>
                        <Avatar sx={{ width: 24, height: 24 }}>{initials}</Avatar>
                        <div>{adviserData.ad_firstname} {adviserData.ad_lastname}</div>
                    </Stack>
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
                        <CircularProgress />
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
