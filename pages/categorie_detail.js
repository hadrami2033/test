
import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, CircularProgress, Tab ,Tabs, } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "../src/components/Table/TableHeader";
import PropTypes from 'prop-types';

const headCellsAmount = [
    {
      id: 'commitement',
      numeric: false,
      disablePadding: true,
      label: "Engagement",
    },
    {
      id: 'amount',
      numeric: false,
      disablePadding: true,
      label: "Montant d'engagement",
    },
    {
      id: 'amount_by_ref_currency',
      numeric: false,
      disablePadding: false,
      label: 'Montant en monnaie de référence',
    }
 ]

 const headCellsInvoice = [
    {
      id: 'reference',
      numeric: false,
      disablePadding: false,
      label: 'Reférence de facture',
    },
    {
      id: 'date',
      numeric: false,
      disablePadding: true,
      label: 'Date de la facture',
    },
    {
      id: 'amount',
      numeric: false,
      disablePadding: true,
      label: 'Montant',
    },
    {
      id: 'paymentmethod',
      numeric: false,
      disablePadding: true,
      label: 'Methode de paiement',
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

const DetailCategorie = (props) => {
  const {categorie, categoriecommitmentsamounts= [], categoriecommitmentsinvoices = [], currency} = props;
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    console.log(currency);
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });


  return (
    <BaseCard titleColor={"secondary"} title={ categorie ? categorie.reference : ""}>
            {/* <Box display="flex" alignItems="center" justifyContent="center">
                <Typography color="secondary" fontSize="25px" fontWeight={'1000'} variant="h2" >{disbursement ? disbursement.reference : ""}</Typography>
            </Box> */}
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
          <Box style={{width:'100%'}}>
            {categorie &&
                <Grid container spacing={2} marginLeft={'15px'}>

                        <Grid item xs={6} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                                Type : {categorie.type.label}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                                Montant de la catégorie : {pounds.format(categorie.amount)}  {currency} 
                            </Typography>
                        </Grid>
                </Grid>
            }


           <Box sx={{ width: '100%', marginTop:'20px', marginLeft: '15px' }}>
               <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                   <Tabs value={value} onChange={handleChange} aria-label="tabs">
                       <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Montans engagés" {...a11yProps(0)} />
                       <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Lignes des factures" {...a11yProps(1)} />
                   </Tabs>
               </Box>  
               <CustomTabPanel value={value} index={0}>
                        <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                            rowCount={categoriecommitmentsamounts.length}
                            headCells={headCellsAmount}
                            headerBG="#c8d789"
                            txtColor="#000000"
                        />
                        <TableBody>
                            {categoriecommitmentsamounts.map((row, index) => {
                                return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    <TableCell align="left"></TableCell>
                                
                                    <TableCell align="left">{row.commitment}</TableCell>
                                    <TableCell align="left">{pounds.format(row.amount)} {row.currency.label}</TableCell>
                                    <TableCell align="left">{pounds.format(row.amount_by_ref_currency)} </TableCell>

                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
               </CustomTabPanel>
               <CustomTabPanel value={value} index={1}>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                            rowCount={categoriecommitmentsinvoices.length}
                            headCells={headCellsInvoice}
                            headerBG="#1A7795"
                            txtColor="#DCDCDC"
                        />
                        <TableBody>
                            {categoriecommitmentsinvoices
                            .map((row, index) => {  
                                return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    <TableCell align="left"></TableCell>

                                    <TableCell align="left">{row.reference} </TableCell>
                                    <TableCell align="left">{formatDate(row.date)} </TableCell>
                                    <TableCell align="left">{pounds.format(row.amount)} {row.currency.label}</TableCell>
                                    <TableCell align="left">{row.paymentmethod} </TableCell>

                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
               </CustomTabPanel>
           </Box>
          </Box>
        }
    </BaseCard>

  );
};

export default DetailCategorie;
