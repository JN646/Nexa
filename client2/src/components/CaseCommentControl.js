import React, { useState } from "react";
import { TextField, Button, Box, Grid } from "@mui/material";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";

const CaseCommentControl = ({ CaseId, Attach, AttachId }) => {
  const [formData, setFormData] = useState({
    case_comment_case_id: CaseId,
    case_comment_attach: Attach,
    case_comment_attach_id: AttachId,
    case_comment_message: "",
  });

  const apiEndpoint = "/api/case-comments/create";
  const apiKey = "6bc32663-fb4f-4b8b-86e7-f08faa2cf302";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "x-api-key": apiKey,
        },
      });

      console.log(response.data);

      // Clear the comment field after successful submission
      setFormData((prevFormData) => ({
        ...prevFormData,
        case_comment_message: "",
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          id="outlined-basic"
          name="case_comment_message"
          label="Enter comment here"
          variant="outlined"
          sx={{ marginBottom: "1rem" }}
          value={formData.case_comment_message}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          autoFocus
        />
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formData.case_comment_message.trim()}
              size="large"
              startIcon={<SendIcon />}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default CaseCommentControl;
