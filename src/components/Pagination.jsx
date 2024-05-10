import React from "react";
import {  Stack, Button } from "@mui/material";

const Pagination = ({ page, setPage }) => {
  const Previous = () => {
    if (page !== 1) {
      setPage(page - 1);
    } else setPage(page);
  };
  const Next = () => {
    if (page < 10) {
      setPage(page + 1);
    }
  };
  return (
    <Stack spacing={5} direction="row" sx={{marginTop:"3rem"}}>
      <Button onClick={Previous} variant="contained" fullWidth sx={{fontWeight:"bold"}}>
        Previous
      </Button>
      <Button onClick={Next} variant="contained" fullWidth sx={{fontWeight:"bold"}}>
        Next
      </Button>
    </Stack>
  );
};

export default Pagination;
