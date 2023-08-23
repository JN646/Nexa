import React, { useState } from "react";
import axios from "axios";

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
            })
            .catch((error) => {
                console.error("Error creating case:", error);
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
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="hidden"
                    name="case_pp_id"
                    value="0"
                    onChange={handleChange}
                />
                <div className="form-group">
                    <label htmlFor="case_ad_id">Adviser ID:</label>
                    <input
                        type="text"
                        name="case_ad_id"
                        id="case_ad_id"
                        className="form-control"
                        value={formData.case_ad_id}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="case_due_date">Due Date:</label>
                    <input
                        type="date"
                        name="case_due_date"
                        id="case_due_date"
                        className="form-control"
                        value={formData.case_due_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="case_type">Type:</label>
                    <select
                        name="case_type"
                        id="case_type"
                        className="form-control"
                        value={formData.case_type}
                        onChange={handleChange}
                    >
                        <option value="">Select a case type</option>
                        <option value="Pension Transfer">Pension Transfer</option>
                        <option value="Retirement Account">Retirement Account</option>
                        <option value="VCT">VCT</option>
                        <option value="Drawdown">Drawdown</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="case_notes">Notes:</label>
                    <textarea
                        name="case_notes"
                        id="case_notes"
                        className="form-control"
                        lines="10"
                        placeholder="Include as much information as possible. Do not include any personal information relating to the client."
                        value={formData.case_notes}
                        onChange={handleChange}
                        style={{ height: "300px" }}
                    />
                </div>
                <button type="submit" className="mt-2 btn btn-primary">Create Case</button>
            </form>
        </div>
    );
};

export default CaseForm;
