import axios from "axios";
import { useState, useEffect } from "react";
import AdviserRating from "./AdviserRating";
import {
  Modal,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Box,
} from "@mui/material";
import Stack from "@mui/material/Stack";

const AdviserDetailsModal = ({ adviserId }) => {
  const [showModal, setShowModal] = useState(false);
  const [adviserData, setAdviserData] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  let initials = adviserData ? adviserData.ad_firstname.charAt(0) : "";

  useEffect(() => {
    // Fetch bid count from the API for the specific bid_case_id
    axios
      .get(`http://localhost:3005/api/advisers/${adviserId}`, {
        headers: {
          "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
        },
      })
      .then((response) => {
        setAdviserData(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching adviser:", error);
      });
  }, [showModal, adviserId]);

  return (
    <div>
      <Button variant="outlined" onClick={handleShow}>
        {adviserData ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 24, height: 24 }}>{initials}</Avatar>
            <Typography variant="body1">
              {adviserData.ad_firstname} {adviserData.ad_lastname}
            </Typography>
          </Stack>
        ) : (
          <CircularProgress size={24} />
        )}
      </Button>
      <Modal
          open={showModal}
          onClose={handleClose}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: 300,
            margin: "auto",
          }}
        >
        <Box p={2} sx={{ backgroundColor: "#f5f5f5" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Adviser Details
            </Typography>
            <Typography variant="body1" id="adviser-details-modal-description">
            {adviserData ? (
              <div>
                <p>
                  <strong>Name:</strong> {adviserData.ad_firstname}{" "}
                  {adviserData.ad_lastname}
                </p>
                <p>
                  <strong>Rating:</strong>{" "}
                  <AdviserRating adviserId={adviserData.ad_id} />
                </p>
              </div>
            ) : (
              <CircularProgress />
            )}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ mt: 2, alignSelf: "center" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

// Export the component
export default AdviserDetailsModal;
