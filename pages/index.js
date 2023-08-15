import React  from 'react';
import { Grid } from "@mui/material";
//import DailyActivity from '../src/components/dashboard/DailyActivity';
import SalesOverview from "../src/components/dashboard/SalesOverview";
//import BlogCard from "../src/components/dashboard/BlogCard";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    /* if(!localStorage.getItem('user')){
      router.push('/login')
    }else{ */
      setAuthenticated(true)
  //  }
  }, [])


  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        {authenticated &&
        <SalesOverview />
        }
      </Grid>
      {/* ------------------------- row 1 ------------------------- */}
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
