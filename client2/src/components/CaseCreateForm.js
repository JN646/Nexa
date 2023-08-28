import React, { useState } from "react";
import axios from "axios";
import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Typography,
    Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CaseForm = () => {
    const [formData, setFormData] = useState({
        case_pp_id: "",
        case_ad_id: "",
        case_due_date: "",
        case_type: "",
        case_bid_price: "",
        case_status: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post("http://localhost:3005/api/cases/create", formData, {
                headers: {
                    "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
                },
            })
            .then((response) => {
                console.log("Case created successfully:", response.data);
                // Reset the form after successful submission
                setFormData({
                    case_pp_id: "",
                    case_ad_id: "",
                    case_due_date: "",
                    case_type: "",
                    case_bid_price: "",
                    case_status: "",
                    case_notes: "",
                });
                setErrorMessage("");
                setSuccessMessage("Case created successfully!");
                setOpen(true);
            })
            .catch((error) => {
                console.error("Error creating case:", error);
                if (error.response.data.errors) {
                    setErrorMessage(error.response.data.errors[0].msg);
                } else {
                    setErrorMessage(error.response.data.error);
                }
                setOpen(true);
            });
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                {successMessage ? (
                    <Alert onClose={handleClose} severity="success">
                        {successMessage}
                    </Alert>
                ) : (
                    <Alert onClose={handleClose} severity="error">
                        {errorMessage}
                    </Alert>
                )}
            </Snackbar>
            <Typography variant="h4" gutterBottom>
                Create Case
            </Typography>
            <form onSubmit={handleSubmit}>
                <input
                    type="hidden"
                    name="case_pp_id"
                    value="0"
                    onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Adviser ID"
                        name="case_ad_id"
                        value={formData.case_ad_id}
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Due Date"
                        type="date"
                        name="case_due_date"
                        value={formData.case_due_date}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: new Date().toISOString().split("T")[0],
                        }}
                    />
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select
                        name="case_type"
                        value={formData.case_type}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Select a case type</MenuItem>
                        <MenuItem value="Pension Transfer">Pension Transfer</MenuItem>
                        <MenuItem value="Retirement Account">Retirement Account</MenuItem>
                        <MenuItem value="VCT">VCT</MenuItem>
                        <MenuItem value="Drawdown">Drawdown</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <TextField
                        label="Notes"
                        name="case_notes"
                        multiline
                        rows={10}
                        placeholder="Include as much information as possible. Do not include any personal information relating to the client."
                        value={formData.case_notes}
                        onChange={handleChange}
                    />
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Create Case
                </Button>
            </form>
        </div>
    );
};

export default CaseForm;
