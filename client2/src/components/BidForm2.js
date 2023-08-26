import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";

const BidForm2 = ({ caseId, adviserId }) => {
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
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && (
        <p style={{ color: "green" }}>{successMessage}</p>
      )}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="hidden"
          value={caseId}
          name="bid_case_id"
          readOnly
        />
        <input
          type="hidden"
          name="bid_ad_id"
          onChange={handleChange}
          value={formData.bid_ad_id}
          readOnly
        />
        <input
          type="hidden"
          name="bid_pp_id"
          onChange={handleChange}
          value="1"
        />
        <TextField
            label="Bid Price"
            type="number"
            name="bid_price"
            min="30"
            onChange={handleChange}
            value={formData.bid_price}
            required
            fullWidth
        />
        <p>Please note that once you have submitted your bid you will not be able to change it.</p>
        <Button variant="contained" color="primary" type="submit">
          Submit Bid
        </Button>
      </form>
    </div>
  );
};

// Export the component as the default object
export default BidForm2;
