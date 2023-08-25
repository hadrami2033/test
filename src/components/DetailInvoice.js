import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Grid, Tooltip, Stack, Box, Tab ,Tabs  } from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import apiService from "../services/apiService";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "./Table/TableHeader";

const headCellsDecaissements = [
     {
      id: 'type',
      numeric: false,
      disablePadding: false,
      label: 'Type',
    },
    {
      id: 'amount',
      numeric: false,
      disablePadding: false,
      label: 'Montant',
    },
    {
      id: 'date',
      numeric: false,
      disablePadding: true,
      label: 'Date décaissement',
    }
]


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }




const DetailInvoice = (props) => {
  const {Invoice, CommitmentId} = props;

  const [Commitment, setCommitment] = useState({})
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    apiService.getCommitment(CommitmentId)
    .then(res => setCommitment(res.data))
  }, [])

  const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  return (
    <BaseCard titleColor={"secondary"} title={Invoice.reference}>

        <Grid container spacing={2} marginLeft={'15px'}>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Methode de paieiment : {Invoice.paymentmethod}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Reférence de paieiment : {Invoice.paymentreference}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Date : {formatDate(Invoice.date)}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Commentaire : {Invoice.comment}
                    </h3>
                </Grid>
        </Grid>


        <Box sx={{ width: '100%', marginTop:'15px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs">
                    <Tab style={{fontWeight:'1000', fontSize:'20px'}} label="L'engagement de la facture" {...a11yProps(0)} />
                </Tabs>
            </Box>


            <CustomTabPanel value={value} index={0}>
            <Grid container spacing={2} marginLeft={'15px'}>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Reférence : {Commitment.reference}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Statut : {Commitment.status}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Date début : {formatDate(Commitment.start_date)}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Date fin : {formatDate(Commitment.end_date)}
                    </h3>
                </Grid>

                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Date de clôture : {formatDate(Commitment.close_date)}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Description : {Commitment.description} 
                    </h3>
                </Grid>
            </Grid>
            </CustomTabPanel>
        </Box>
    </BaseCard>

  );
};

export default DetailInvoice;
