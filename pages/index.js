import React  from 'react';
import { Grid } from "@mui/material";
//import DailyActivity from '../src/components/dashboard/DailyActivity';
import Dashboard from "../src/components/dashboard/Dashboard";
//import BlogCard from "../src/components/dashboard/BlogCard";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter()

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Dashboard/>
      </Grid>
     {/*  <Grid item xs={12} lg={4}>
        <DailyActivity />
      </Grid>
      <Grid item xs={12} lg={8}>
        <Clients />
      </Grid> 
      <Grid item xs={12} lg={12}>
        <BlogCard />
      </Grid>*/}
    </Grid>
  );
}
