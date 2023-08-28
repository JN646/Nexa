import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

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
    <TableContainer component={Paper}>
      <Table aria-label="dense table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditCases.map((auditCase) => (
            <TableRow key={auditCase.caseId}>
              <TableCell component="th" scope="row">
                {formatDate(auditCase.audit_created_at)}
              </TableCell>
              <TableCell>{auditCase.audit_message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuditCaseList;
