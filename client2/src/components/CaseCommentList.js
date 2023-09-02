import React, { useEffect, useState } from "react";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Box, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CaseCommentList = ({ caseId }) => {
    const [cases, setCaseComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/case-comments/case/${caseId}`, {
                    headers: {
                        'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
                    }
                });
                setCaseComments(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [caseId]);

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`/api/case-comments/delete/${commentId}`, {
                headers: {
                    'x-api-key': '6bc32663-fb4f-4b8b-86e7-f08faa2cf302'
                }
            });
            setCaseComments((prevComments) => prevComments.filter(comment => comment.case_comment_id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <List sx={{ width: '100%' }}>
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
                            {caseComment.case_comment_attach === 'Paraplanner' && (
                                <IconButton onClick={() => handleDelete(caseComment.case_comment_id)}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}

export default CaseCommentList;
