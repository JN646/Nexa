import React from "react";
import {TextField, Button, Box} from "@mui/material";

const CaseCommentControl = () => {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <TextField id="outlined-basic" label="Enter comment here" variant="outlined" sx={{width: '100%'}} />
            <Button variant="contained" color="primary" sx={{marginTop: '1rem'}}>
                Submit
            </Button>
        </Box>
    );
};

// Export the component as the default object
export default CaseCommentControl;