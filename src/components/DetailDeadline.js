
import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, CircularProgress, Tab ,Tabs, Stack, Tooltip, Fab, Dialog, DialogContent, IconButton, Snackbar, Alert, Paper, DialogContentText, DialogTitle, Button, DialogActions, } from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "./Table/TableHeader";
import PropTypes from 'prop-types';
import useAxios from "../utils/useAxios";
import { Add, Close, CreateOutlined, Delete } from "@mui/icons-material";
import PaymentForm from "../../pages/add_payment";
import Draggable from "react-draggable";


 const headCellsPayments = [
    {
      id: 'reference',
      numeric: false,
      disablePadding: false,
      label: 'Reférence de paiement',
    },
    {
      id: 'date',
      numeric: false,
      disablePadding: true,
      label: 'Date de paiement',
    },
    {
      id: 'amount',
      numeric: false,
      disablePadding: true,
      label: 'Montant',
    },
    {
      id: 'comment',
      numeric: false,
      disablePadding: true,
      label: 'Commentaire',
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: true,
      label: 'Actions',
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

const DetailDeadline = (props) => {
  const {deadline, currency} = props;
  const axios = useAxios();

  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [status, setStatus] = React.useState([]);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [deadlinespayments, setDeadlinespayments] = React.useState([]);
  const [openPaymentForm, setOpenPaymentForm] = React.useState(false);
  const [paymentSelected, setPaymentSelected] = React.useState(null);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(null);

  useEffect(() => {
    setLoading(true)
    if(deadline){
        setDeadlinespayments(deadline.deadlinespayments)
        setLoading(false)
    }else{
        setLoading(false)
    }
  }, [])

  const push = (e) =>{
    setLoading(true)
    axios.get(`/deadlines/${deadline.id}`).then(res => {
      setDeadlinespayments(res.data.deadlinespayments)
    },
    error => {
      console.log(error)
    }
    )
    .then(() => {
        setLoading(false)
    })
  }

  const showFailedToast = () => {
    setOpenFailedToast(true);
  };

  const showSuccessToast = () => {
    setOpenSuccessToast(true);
  };

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

  const deadlineDatePassed = (d1, d2) => {
    return formatDate(d1)> formatDate(d2);
  }

  const deadlineCummulePayments = () => {
    var sum = deadlinespayments ? deadlinespayments.reduce((accumulator, e) => {
      return accumulator + e.amount
    },0) : 0;
    return sum;
  }

  const deadlineState = () => {
    let now = new Date().toDateString()
    if(deadlineCummulePayments() >= deadline.amount)
      return 1;
    else if(deadlineDatePassed(now, deadline.date))
      return 3;
    else return 2;
  }

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

  const editPayment = (p) =>{
    setPaymentSelected(p)
    setOpenPaymentForm(true)
  }

  const openAddPayment = () => {
    setOpenPaymentForm(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setPaymentSelected(null)
      setOpenPaymentForm(false);
    }
  };
  const handleOpenModalDelete = () =>{
    setOpenDelete(true)
  }

  const handleCloseDelete = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setToDelete(null)
      setOpenDelete(false);
    }
  };

  const deletePayment = (row) => {
    setToDelete(row)
    handleOpenModalDelete()
  }

  const confirmDeletePayment = () => {
    if(toDelete !== null){
      axios.delete(`/deadlinepayments/${toDelete.id}`).then(
        res => {
          console.log(res);
          const index = deadlinespayments.indexOf(toDelete);
          deadlinespayments.splice(index, 1);
          setToDelete(null)
          handleCloseDelete()
          showSuccessToast()
        },
        error => {
          console.log(error)
          showFailedToast()
        }
      )      
    }
  }

  const PaperComponent = (props) => {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }

  return (
    <BaseCard titleColor={"secondary"} title={ deadline ? deadline.reference : ""}>
            {/* <Box display="flex" alignItems="center" justifyContent="center">
                <Typography color="secondary" fontSize="25px" fontWeight={'1000'} variant="h2" >{disbursement ? disbursement.reference : ""}</Typography>
            </Box> */}
          <Box style={{width:'100%'}}>
            {deadline &&
                <Grid container spacing={2} marginLeft={'15px'}>
                    <Dialog fullWidth={true} maxWidth={'lg'} open={openPaymentForm} onClose={handleClose}>
                        <DialogContent>
                        <div style={{display:"flex", justifyContent:"end"}}>
                            <IconButton onClick={handleClose}>
                                <Close fontSize='medium'/>
                            </IconButton>
                        </div>
                        <PaymentForm
                           deadlineId = {deadline.id}
                           push={push}
                           showSuccessToast={showSuccessToast}
                           showFailedToast={showFailedToast}
                           availableAmount={paymentSelected ? (deadline.amount-deadlineCummulePayments()+paymentSelected.amount) : (deadline.amount-deadlineCummulePayments())}
                           payment= {paymentSelected}
                        /> 
                        </DialogContent>
                    </Dialog>

                    
                    <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openSuccessToast} autoHideDuration={6000} onClose={closeSuccessToast}>
                        <Alert onClose={closeSuccessToast} severity="success" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
                            L'oppération réussie
                        </Alert>
                    </Snackbar>

                    <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openFailedToast} autoHideDuration={6000} onClose={closeFailedToast}>
                        <Alert onClose={closeFailedToast} severity="error" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
                            L'oppération a échoué !
                        </Alert>
                    </Snackbar>

                    <Dialog 
                        open={openDelete}
                        onClose={handleCloseDelete}
                        PaperComponent={PaperComponent}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle style={{ cursor: 'move', display:"flex" ,justifyContent:"end" , fontSize:"24px",fontWeight:"bold" }} id="draggable-dialog-title">
                        Suppression
                        </DialogTitle>
                        <DialogContent style={{width:300,display:"flex" ,justifyContent:"center" }}>
                        <DialogContentText>
                            Confirmer l'oppération
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button style={{fontSize:"24px",fontWeight:"bold"}} autoFocus onClick={handleCloseDelete}>
                            Annuler
                        </Button>
                        <Button style={{fontSize:"24px",fontWeight:"bold"}} onClick={confirmDeletePayment}>Supprimer</Button>
                        </DialogActions>
                    </Dialog>


                   <Grid item xs={6} sx={{color:"#837B7B", fontWeight: "bold"}} >
                       <Typography
                           color="#837B7B"
                           sx={{
                           fontSize: "h4.fontSize",
                           fontStyle:'initial'
                           }}
                       >
                           Montant d'échéance : {pounds.format(deadline.amount)}  {currency} 
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
                           Date : {formatDate(deadline.date)}
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
                           Order : {deadline.order}
                       </Typography>
                   </Grid>
                   <Grid item xs={6} sx={{color:"#837B7B", fontWeight: "bold", display:"flex", flexDirection:"row"}} >
                        <Typography
                          color="#837B7B"
                          sx={{
                          fontSize: "h4.fontSize",
                          fontStyle:'initial',
                          marginInlineEnd : 1
                          }}
                        >
                        Etat : 
                      </Typography>

                      {deadlineState() === 1 &&
                        <Typography
                          color="#1A7795"
                          sx={{
                          fontSize: "h4.fontSize",
                          fontStyle:'initial'
                          }}
                        >
                          Payée
                        </Typography>
                      }
                      {deadlineState() === 2 &&
                        <Typography
                          color="#837B7B"
                          sx={{
                          fontSize: "h4.fontSize",
                          fontStyle:'initial'
                          }}
                        >
                          Non payée
                        </Typography>
                      }
                      {deadlineState() === 3 &&
                        <Typography
                          color="#e46a76"
                          sx={{
                          fontSize: "h4.fontSize",
                          fontStyle:'initial'
                          }}
                        >
                          Date de paiement dépassée
                        </Typography>
                      }
                   </Grid>

                </Grid>
            }

            {deadline &&
           <Box sx={{ width: '100%', marginTop:'20px', marginLeft: '15px' }}>
               <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                   <Tabs value={value} onChange={handleChange} aria-label="tabs">
                       <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Paiements realisés" {...a11yProps(0)} />
                   </Tabs>
               </Box> 
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
               <CustomTabPanel value={value} index={0}>
                    <Stack spacing={2} direction="row" mb={2} >
                      <Tooltip title="Ajouter">
                        <Fab color="secondary" size="medium" aria-label="Ajouter" onClick={openAddPayment}
                        >
                            <Add/>
                        </Fab>
                      </Tooltip>
                    </Stack>
                    {deadlinespayments.length > 0 ?
                      <Table
                          sx={{ minWidth: 750 }}
                          aria-labelledby="tableTitle"
                          size={'medium'}
                          >
                          <EnhancedTableHead
                              rowCount={deadlinespayments.length}
                              headCells={headCellsPayments}
                              headerBG="#1A7795"
                              txtColor="#DCDCDC"
                          />
                          <TableBody>
                              {deadlinespayments
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
                                      <TableCell align="left">{pounds.format(row.amount)} {currency}</TableCell>
                                      <TableCell align="left">{row.comment} </TableCell>
                                      
                                      <TableCell align="left">
                                        <Tooltip onClick={() => editPayment(row)} title="Modifier">
                                            <IconButton>
                                                <CreateOutlined fontSize='medium' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip onClick={() => deletePayment(row)} title="Supprimer">
                                            <IconButton>
                                                <Delete color='danger' fontSize='medium' />
                                            </IconButton>
                                        </Tooltip>
                                      </TableCell>
                                  </TableRow>
                                  );
                              })}
                          </TableBody>
                      </Table>
                      :
                      <div style={{width: "100%", marginTop: '20px', display: 'flex', justifyContent: "center"}}>
                          <Box style={{fontSize: '16px'}}>
                          Liste vide
                          </Box>
                      </div>
                    }
               </CustomTabPanel>
                }
           </Box>
           }
          </Box>
                        
        
    </BaseCard>

  );
};

export default DetailDeadline;
