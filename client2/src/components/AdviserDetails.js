import axios from "axios";
import { useState, useEffect } from "react";
import AdviserRating from "./AdviserRating";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography, Link } from "@mui/material";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const AdviserDetails = ({ adviserId }) => {
  const [adviserData, setAdviserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/advisers/${adviserId}`, {
          headers: {
            "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
          },
        });
        setAdviserData(response.data[0]);
      } catch (error) {
        console.error("Error fetching adviser:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adviserId]);

  const handlePhoneClick = () => {
    if (adviserData) {
      window.location.href = `tel:${adviserData.ad_tel}`;
    }
  };

  const handleEmailClick = () => {
    if (adviserData) {
      window.location.href = `mailto:${adviserData.ad_email}`;
    }
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : adviserData ? (
        <Box>
          <Typography variant="body1">
            {`${adviserData.ad_firstname} ${adviserData.ad_lastname}`}
          </Typography>
          <Typography variant="body1">
            <AdviserRating adviserId={adviserData.ad_id} />
          </Typography>
          <Typography variant="body1">
            <PhoneIcon />{" "}
            <Link href={`tel:${adviserData.ad_tel}`} onClick={handlePhoneClick}>
              {adviserData.ad_tel}
            </Link>
          </Typography>
          <Typography variant="body1">
            <EmailIcon />{" "}
            <Link href={`mailto:${adviserData.ad_email}`} onClick={handleEmailClick}>
              {adviserData.ad_email}
            </Link>
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1">Adviser data not found.</Typography>
      )}
    </Box>
  );
};

export default AdviserDetails;
