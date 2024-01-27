
import React, { useEffect, useState } from "react";
import {Box, CircularProgress } from "@mui/material";
import useAxios from "../src/utils/useAxios";
import { useRouter } from "next/router";
import AuthContext from "../src/context/AuthContext";
import DetailDeadline from "../src/components/DetailDeadline";

export default function DetailDeadlines () {
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState(null);

  const router = useRouter();
  const axios = useAxios();

  const {id, currency} = router.query

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