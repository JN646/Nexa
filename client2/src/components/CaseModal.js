import React, { useState, useEffect } from "react";
import { Modal, Button, Typography } from "@mui/material";
import axios from "axios";
import BidForm2 from "./BidForm2";
import BidCount from "./BidCount";
import AdviserRating from "./AdviserRating";

const CaseModal = ({ caseId }) => {
  const [showModal, setShowModal] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false); // new state variable

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const fetchCaseData = async () => {
      const response = await axios.get(
        `http://localhost:3005/api/cases/${caseId}`,
        {
          headers: {
            "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
          },
        }
      );
      setCaseData(response.data);
    };
    if (showModal) {
      fetchCaseData();
    }
  }, [showModal, caseId]);

  const handleBidSuccess = () => {
    setBidSuccess(true);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleShow}>
        View
      </Button>

      {/* Display case information here */}
      {caseData && (
        <Modal
          open={showModal}
          onClose={handleClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              maxWidth: "400px",
              padding: "16px",
              borderRadius: "4px",
            }}
          >
            <div style={{ padding: "16px" }}>
              <Typography variant="h5">Case Details</Typography>
              <Typography variant="body1">
                <strong>Adviser:</strong> {caseData[0].ad_firstname}{" "}
                {caseData[0].ad_lastname}
              </Typography>
              <Typography variant="body1">
                <strong>Rating:</strong>{" "}
                <AdviserRating adviserId={caseData[0].case_ad_id} />
              </Typography>
              <Typography variant="body1">
                <strong>Due Date:</strong>{" "}
                {new Date(caseData[0].case_due_date).toLocaleDateString(
                  "en-GB"
                )}
              </Typography>
              <Typography variant="body1">
                <strong>Type:</strong> {caseData[0].case_type}
              </Typography>
              <Typography variant="body1">
                <strong>Number of bids: </strong>
                <BidCount bidCaseId={caseData[0].case_id} />
              </Typography>
              <Typography variant="body1">
                <strong>Notes:</strong>
              </Typography>
              {caseData[0].case_notes ? (
                <Typography variant="body1">
                  {caseData[0].case_notes}
                </Typography>
              ) : (
                <Typography variant="body1">No notes available</Typography>
              )}

              {/* Bid Form */}
              {!bidSuccess && ( // conditionally render the bid form
                <>
                  <Typography variant="h6">Place a bid</Typography>
                  <BidForm2
                    caseId={caseId}
                    adviserId={caseData[0].case_ad_id}
                    onBidSuccess={handleBidSuccess} // pass the success handler to the bid form
                  />
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CaseModal;
