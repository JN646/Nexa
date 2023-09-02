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
import { Typography } from "@mui/material";

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
    return date.toLocaleString();
  };

  return (
    <Timeline position="right">
      {auditCases.map((auditCase) => (
        <TimelineItem key={auditCase.caseId}>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
              <Typography variant="caption">
                {formatDate(auditCase.audit_created_at)}
              </Typography>
              <Typography variant="body2">{auditCase.audit_message}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default AuditCaseList;
