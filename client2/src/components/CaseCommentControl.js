import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

const CaseCommentControl = ({ CaseId, Attach, AttachId }) => {
  const [formData, setFormData] = useState({
    case_comment_case_id: CaseId,
    case_comment_attach: Attach,
    case_comment_attach_id: AttachId,
    case_comment_message: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const apiEndpoint = "/api/case-comments/create";
    const apiKey = "6bc32663-fb4f-4b8b-86e7-f08faa2cf302";

    axios
      .post(apiEndpoint, formData, {
        headers: {
          "x-api-key": apiKey,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
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
        <input
          type="hidden"
          name="case_comment_case_id"
          value={formData.case_comment_case_id}
        />
        <input
          type="hidden"
          name="case_comment_attach"
          value={formData.case_comment_attach}
        />
        <input
          type="hidden"
          name="case_comment_attach_id"
          value={formData.case_comment_attach_id}
        />
        <TextField
          id="outlined-basic"
          name="case_comment_message"
          label="Enter comment here"
          variant="outlined"
          sx={{ width: "100%" }}
          value={formData.case_comment_message}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: "1rem" }}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default CaseCommentControl;
