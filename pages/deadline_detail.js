
import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, CircularProgress, Tab ,Tabs, Stack, Tooltip, Fab, } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "../src/components/Table/TableHeader";
import PropTypes from 'prop-types';
import useAxios from "../src/utils/useAxios";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/router";
import AuthContext from "../src/context/AuthContext";
import DetailDeadline from "../src/components/DetailDeadline";



const detailDeadline = () => {
  const router = useRouter()
  const {id, currency} = router.query
  const axios = useAxios();

  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [deadline, setDeadline] = React.useState(null);

  const { logoutUser } = React.useContext(AuthContext);

  useEffect(() => {
    if(id){ 
      setLoading(true)
      axios.get(`/deadlines/${id}`).then(res => {
        setDeadline(res.data)
      },
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
      )
      .then(() => {
          setLoading(false)
      })
    } 
  }, [])

  return (
    <>
    {loading ?
     <Box style={{width:'100%', display:'flex', justifyContent:"center" }}>
       <CircularProgress
         size={24}
           sx={{
           color: 'primary',
           position: 'absolute',
           marginTop: '-12px',
           marginLeft: '-12px',
         }}
       />
     </Box>
   :
   <DetailDeadline 
      deadline = {deadline} 
      currency = {currency} 
    />
   }
</> 
  );
};

export default detailDeadline;
