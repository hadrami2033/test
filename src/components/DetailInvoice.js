import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Grid, Tooltip, Stack, Box, Tab ,Tabs, IconButton, DialogContent, Dialog, Snackbar, Alert, DialogTitle, DialogContentText, DialogActions, Paper  } from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "./Table/TableHeader";
import DeleteIcon from '@mui/icons-material/Delete';
import InvoiceLineForm from "../../pages/add_invoiceline";
import { Close } from "@mui/icons-material";
import Draggable from "react-draggable";
import useAxios from "../utils/useAxios";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const headCellsInvoicelines = [
    {
      id: 'amount',
      numeric: false,
      disablePadding: false,
      label: 'Montant',
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: true,
      label: 'Action'
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
  const {id} = props;
  const axios = useAxios();
  const [Commitment, setCommitment] = useState({})
  const [value, setValue] = React.useState(0);
  const [Invoice, setInvoice] = React.useState({});
  const [invoicelines, setInvoiceLines] = React.useState([]);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [line, setLine] = React.useState(null);

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

  const showFailedToast = () => {
    setOpenFailedToast(true);
  };

  const showSuccessToast = () => {
    setOpenSuccessToast(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpen(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const router = useRouter()
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
    if(id){ 
      axios.get(`/invoices/${id}`).then(res => {
        setInvoice(res.data)
        setInvoiceLines(res.data.invoicelines)
        axios.get(`/commitments/${res.data.commitment}`)
        .then(res => setCommitment(res.data))
      },
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
      )
    }else{
      router.push("/invoices")
    }
  }, [])


  const push = (e) =>{
    axios.get(`/invoices/${id}`).then(res => {
      setInvoice(res.data)
      setInvoiceLines(res.data.invoicelines)
      axios.get(`/commitments/${res.data.commitment}`)
      .then(res => setCommitment(res.data))
    })
  }

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

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

  const handleCloseModalDelete = () =>{
    setOpenDelete(false)
  }

  const handleOpenModalDelete = (e) =>{
    setLine(e)
    setOpenDelete(true)
  }

  const remove = () =>{
    if(line){
      axios.delete(`/invoicelines/${line.id}`).then(
        res => {
          console.log(res);
          const index = invoicelines.indexOf(line);
          invoicelines.splice(index, 1);
          handleCloseModalDelete()
          setLine(null)
          showSuccessToast()
        },
        error => {
          console.log(error)
          showFailedToast()
        }
      )
    }      
  }

  return (
    <BaseCard titleColor={"secondary"} title={Invoice.reference}>

      <Dialog 
        open={openDelete}
        onClose={handleCloseModalDelete}
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
          <Button style={{fontSize:"24px",fontWeight:"bold"}} autoFocus onClick={handleCloseModalDelete}>
            Annuler
          </Button>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} onClick={remove}>Supprimer</Button>
        </DialogActions>
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

        <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleClose}>
          <DialogContent>
            <div style={{display:"flex", justifyContent:"end"}}>
              <IconButton onClick={handleClose}>
                <Close fontSize='large'/>
              </IconButton>
            </div>
            <InvoiceLineForm
              push={push} 
              update={push}
              showSuccessToast={showSuccessToast}
              showFailedToast={showFailedToast}
              invoiceId = {Invoice.id}
            />
          </DialogContent>
        </Dialog>
        <Grid container spacing={2} marginLeft={'15px'}>
            <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                <Typography
                    color="#837B7B"
                    sx={{
                    fontSize: "h4.fontSize",
                    fontStyle:'initial'
                    }}
                >
                    Date : {formatDate(Invoice.date)}
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
                    Methode de paieiment : {Invoice.paymentmethod}
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
                    Reférence de paieiment : {Invoice.paymentreference}
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
                    Commentaire : {Invoice.comment}
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
                    Sur l'engagement : {Commitment.reference}
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
                    Statut d'engagement : {Commitment.status}
                </Typography>
            </Grid>
        </Grid>


        <Grid container 
            sx={{
                mt:"20px",
                mb:"30px"
            }}
          >
            <Grid
                item
                xs={12}
                lg={12}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:"center"
                }}
            >
                                        
               <Button
                   variant="contained"
                   sx={{
                   fontSize: "h3.fontSize",
                   fontWeight: "600",
                   mt: "15px",
                   marginInline:"32px",
                   marginTop:1,
                   width:'30%',
                   minWidth:"250px"
                   }}
                   color={'primary'}
                   onClick={handleClickOpen}
               >
                   + Ajouter une ligne
               </Button> 
       </Grid>

      </Grid>

        <Box sx={{ width: '100%', marginTop:'15px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs">
                    <Tab style={{fontWeight:'1000', fontSize:'20px'}} label="L'engagement de la facture" {...a11yProps(0)} />
                </Tabs>
            </Box>


            <CustomTabPanel value={value} index={0}>
            {invoicelines.length > 0 ?
                <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'medium'}
                >
                <EnhancedTableHead
                    rowCount={invoicelines.length}
                    headCells={headCellsInvoicelines}
                    headerBG="#1A7795"
                    txtColor="#DCDCDC"
                />
                <TableBody>
                    {invoicelines
                    .map((row, index) => {
                        return (
                        <TableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
                        >
                           
                            <TableCell align="left"></TableCell>
                            <TableCell align="left">{pounds.format(parseFloat(row.amount).toFixed(2))} {row.currency.label} </TableCell>
                            <TableCell align="left">
                              <Tooltip onClick={() => handleOpenModalDelete(row)} 
                                  title="supprimer">
                                  <IconButton>
                                      <DeleteIcon color='danger' fontSize='medium' />
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
        </Box>
    </BaseCard>

  );
};

export default DetailInvoice;
