import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import BidForm from './BidForm';
import BidCount from './BidCount';
import AdviserRating from './AdviserRating';

const CaseModal = ({ caseId }) => {
    const [showModal, setShowModal] = useState(false);
    const [caseData, setCaseData] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    useEffect(() => {
        const fetchCaseData = async () => {
            const response = await axios.get(`http://localhost:3005/api/cases/${caseId}`, {
                headers: {
                    "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
                },
            });
            setCaseData(response.data);
        };
        if (showModal) {
            fetchCaseData();
        }
    }, [showModal, caseId]);

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                View
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Case Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Display case information here */}
                    {caseData && (
                        <>
                            <p><strong>Adviser:</strong> {caseData[0].ad_firstname} {caseData[0].ad_lastname}</p>
                            <p><strong>Rating:</strong> <AdviserRating adviserID={caseData[0].case_ad_id} /></p>
                            <p><strong>Due Date:</strong> {new Date(caseData[0].case_due_date).toLocaleDateString('en-GB')}</p>
                            <p><strong>Type:</strong> {caseData[0].case_type}</p>
                            <p><strong>Number of bids: </strong>
                                <BidCount bidCaseId={caseData[0].case_id} />
                            </p>
                            <p><strong>Notes:</strong></p> 
                            {caseData[0].case_notes ? (
                                <p>{caseData[0].case_notes}</p>
                            ) : (
                                <p>No notes available</p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <BidForm caseId={caseId} bidAdId={1} />
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CaseModal;
