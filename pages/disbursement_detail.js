
import React, { useEffect, useState } from "react";
import { Alert, Card, CardContent, Typography, Button, Grid, Tooltip, Stack,Snackbar, Box, Tab ,Tabs, CircularProgress  } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import { Close, CreateOutlined, InfoOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';





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




const DetailDisbursement = (props) => {
  const {disbursement, disbursementStatus, disbursementtypes, currency} = props;

  const [convention, setConvention] = React.useState(null);
  const [borrower, setBorrower] = useState({})
  const [funder, setFunder] = useState({})
  const [value, setValue] = React.useState(0);
  const [disbursements, setDisbursements] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [deadlines, setDeadlines] = React.useState([]);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openCategorieForm, setOpenCategorieForm] = React.useState(false);
  const [disburssementSelected, setDisburssementSelected] = React.useState(null);
  const [categorieSelected, setCategorieSelected] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [currenteState, setCurrenteState] = React.useState({});
  const [availabeState, setAvailabeState] = React.useState({});
  const [commitments, setCommitments] = React.useState([]);
  const [invoices, setInvoices] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    console.log(disbursement);
    console.log(disbursementStatus);
    console.log(disbursementtypes);
    console.log(currency);
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

  const retrocede = (r) => {
    var res = r ? "Oui" : "Non";
    return res;
  }

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const closeFailedToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenFailedToast(false);
  };

  const closeSuccessToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessToast(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setDisburssementSelected(null)
      setOpen(false);
    }
  };

  const handleCloseCategorie = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenCategorieForm(false);
    }
  };

  

  const getStatusByCode = (code) =>{
    if(code){
      let e = disbursementStatus.filter(e => e.code === code );
      return e[0].label
    }
    return null;
  }

  const getCurrenteState = () => {
    let currente_state = disbursement.status.length > 0 ? 
    getStatusByCode(Math.max(...disbursement.status.map(s => s.type.code)))
    : getStatusByCode(1);
    return currente_state;
  }



  const getDisbursementStatusByCode = (code) =>{
    if(code){
      let e = disbursement.status.filter(e => e.type.code === code );
      let res = e[0] ? e[0].type.label : null
      return res
    }
    return null;
  }

  const getDisbursementStatusDateByCode = (code) =>{
    if(code){
      let e = disbursement.status.filter(e => e.type.code === code );
      let res = e[0].date ? e[0].date : null
      return res
    }
    return null;
  }


  const getTypeByCode = (code) =>{
    if(code){
      let e = disbursementtypes.filter(e => e.code === code );
      return e[0].label
    }
    return null;
  }


  const getType = (id) => {
    if(id){
        let e = disbursementtypes.filter(e => e.id === id );
        return e[0].label
    }
    return null
  }


  return (
    <BaseCard titleColor={"secondary"} title={ disbursement ? disbursement.reference : ""}>
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
            {disbursement && disbursementStatus.length > 0 && disbursementtypes.length > 0 &&
                <Grid container spacing={2} marginLeft={'15px'}>

                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                                Type : {disbursement.type.label}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                                Date : {formatDate(disbursement.date)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                                Montant demandé : {pounds.format(disbursement.orderamount)}  {disbursement.currency.label} 
                            </Typography>
                        </Grid>
                        {getType(disbursement.type.id) === getTypeByCode(1) &&
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Catégorie : {disbursement.categorie.reference}
                            </Typography>
                        </Grid>
                        }{getType(disbursement.type.id) === getTypeByCode(1) &&
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Engagement : {disbursement.commitment.reference}
                            </Typography>
                        </Grid>
                        }{getType(disbursement.type.id) === getTypeByCode(1) &&
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Facture : {disbursement.invoice.reference}
                            </Typography>
                        </Grid>
                        }

                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Etat : {getCurrenteState()}
                            </Typography>
                        </Grid>
                        {getDisbursementStatusByCode(2) &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Date d'envoi : {getDisbursementStatusDateByCode(2) ?
                             formatDate(getDisbursementStatusDateByCode(2)) : null }
                            </Typography>
                        </Grid>
                        }{getDisbursementStatusByCode(3) &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Date de recéption : {getDisbursementStatusDateByCode(3) ?
                             formatDate(getDisbursementStatusDateByCode(3)) : null }
                            </Typography>
                        </Grid>
                        }

                        {getDisbursementStatusByCode(4) &&
                        <Grid item xs={6}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Date du cloture : {getDisbursementStatusDateByCode(4) ?
                             formatDate(getDisbursementStatusDateByCode(4)) : null }
                            </Typography>
                        </Grid>
                        }{disbursement.disbursementamount &&
                        <Grid item xs={6}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Montant décaissé : {pounds.format(disbursement.disbursementamount)} {currency}
                            </Typography>
                        </Grid>
                        }                        
                    </Grid>
                }
          </Box>
        }
    </BaseCard>

  );
};

export default DetailDisbursement;
