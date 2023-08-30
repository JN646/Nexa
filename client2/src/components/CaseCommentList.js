import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';

const CaseCommentList = ({ caseId }) => {
    const [cases, setCaseComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all bids from the API
        axios.get(`/api/case-comments/case/${caseId}`, {
            headers: {
                'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
            }
        })
          .then(response => {
            setCaseComments(response.data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching bids:', error);
          });
      }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <List sx={{ width: '100%', maxWidth: 360 }}>
                    {cases.map((caseComment) => (
                        <ListItem key={caseComment.case_comment_id} alignItems="flex-start" sx={{ backgroundColor: caseComment.case_comment_attach === 'Adviser' ? '#DDDDDD' : 'inherit' }}>
                            <ListItemText
                                primary={new Date(caseComment.case_comment_dtlc).toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric' })}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {caseComment.case_comment_message}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}

// Export the component as the default object
export default CaseCommentList;