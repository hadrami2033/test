import React from "react";

import {
  Card,
  CardContent,
  Box,
  Typography,
} from "@mui/material";

const BaseCard = (props) => {
  return (
    <Card >
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography color={props.titleColor} fontSize="25px" fontWeight={'1000'} variant="h2" >{props.title}</Typography>
      </Box>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};

export default BaseCard;
