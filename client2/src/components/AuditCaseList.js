import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { Paper, Box } from "@mui/material";

const AuditCaseList = ({ caseId }) => {
  const [auditCases, setAuditCases] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/audit/case/${caseId}`, {
        headers: {
          "x-api-key": "6bc32663-fb4f-4b8b-86e7-f08faa2cf302",
        },
      })
      .then((response) => {
        setAuditCases(response.data);
      })
      .catch((error) => {
        console.error("Error fetching audit cases:", error);
      });
  }, [caseId]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
    const formattedDate = day + "/" + month + "/" + year;
    return formattedTime + " " + formattedDate;
  };

  return (
    <Timeline position="alternate">
      {auditCases.map((auditCase) => (
        <TimelineItem key={auditCase.caseId}>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Box elevation={3} sx={{ p: 1 }}>
              <p>{formatDate(auditCase.audit_created_at)}</p>
              <p>{auditCase.audit_message}</p>
            </Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

// Export component
export default AuditCaseList;
