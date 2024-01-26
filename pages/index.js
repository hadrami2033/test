import React  from 'react';
import { Grid } from "@mui/material";
import Dashboard from "../src/components/dashboard/Dashboard";

export default function Index() {

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Dashboard/>
      </Grid>
    </Grid>
  );
}
