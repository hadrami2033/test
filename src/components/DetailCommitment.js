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

const headCells = [
   {
     id: 'reference',
     numeric: false,
     disablePadding: false,
     label: 'Référence',
   },
   {
     id: 'date',
     numeric: false,
     disablePadding: true,
     label: 'Date du facture',
   },
   {
    id: 'paymentmethod',
    numeric: false,
    disablePadding: true,
    label: 'Méthode de peiment',
  },
  {
    id: 'paymentreference',
    numeric: false,
    disablePadding: true,
    label: 'Référence de peiment',
  },
  {
    id: 'comment',
    numeric: false,
    disablePadding: true,
    label: 'Commentaire'
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




const DetailCommitment = (props) => {
  const {commitment, contractorId} = props;

  const [contractor, setContractor] = useState({})
  const [value, setValue] = React.useState(0);
  const [invoices, setInvoices] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    apiService.getContractor(contractorId)
    .then(res => setContractor(res.data))
  }, [])

   useEffect(() => {
    apiService.getInvoices()
    .then(res => setInvoices(res.data))   
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
    <BaseCard titleColor={"secondary"} title={commitment.reference}>

        <Grid container spacing={2} marginLeft={'15px'}>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Date début : {formatDate(commitment.start_date)}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Date fin : {formatDate(commitment.end_date)}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Statut : {commitment.status}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Date de clôture : {formatDate(commitment.close_date)}
                    </h3>
                </Grid>
                <Grid item xs={6}>
                    <h3 style={{color:'#837B7B'}}>
                    Description : {commitment.description} 
                    </h3>
                </Grid>
        </Grid>


        <Box sx={{ width: '100%', marginTop:'15px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs">
                    <Tab style={{fontWeight:'1000', fontSize:'20px'}} label="Les factures d'engagement" {...a11yProps(0)} />
                    <Tab style={{fontWeight:'1000', fontSize:'20px'}} label="Prestateur d'engagement" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
                <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'medium'}
                >
                <EnhancedTableHead
                    rowCount={invoices.length}
                    headCells={headCells}
                    headerBG="#ecf0f2"
                    txtColor="#000000"
                />
                <TableBody>
                    {invoices
                    .map((row, index) => {
                        return (
                        <TableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
                            style={{backgroundColor: row.deleted ? '#e67e5f' : ""}}
                        >
                           
                            <TableCell align="left"></TableCell>
                            <TableCell align="left">{row.reference}</TableCell>
                            <TableCell align="left">{formatDate(row.date)} </TableCell>
                            <TableCell align="left">{row.paymentmethod}</TableCell>
                            <TableCell align="left">{row.paymentreference}</TableCell>
                            <TableCell align="left">{row.comment}</TableCell>

                        </TableRow>
                        );
                    })}
                </TableBody>
               </Table>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Grid container spacing={2} marginLeft={'15px'}>
                    <Grid item xs={6}>
                        <h3 style={{color:'#837B7B'}}>
                            Label : {contractor.label}
                        </h3>
                    </Grid>
                    <Grid item xs={6}>
                        <h3 style={{color:'#837B7B'}}>
                           Addresse : {contractor.address}
                        </h3>
                    </Grid>
                    <Grid item xs={6}>
                        <h3 style={{color:'#837B7B'}}>
                            Teléphone : {contractor.telephone}
                        </h3>
                    </Grid>
                    <Grid item xs={6}>
                        <h3 style={{color:'#837B7B'}}>
                            Iban : {contractor.iban}
                        </h3>
                    </Grid>
                </Grid>
            </CustomTabPanel>
        </Box>
    </BaseCard>

  );
};

export default DetailCommitment;
