import React, { useEffect, useState } from "react";
import { Alert, Typography, Button, Grid, Box, Tab ,Tabs, Snackbar, Tooltip, IconButton, DialogTitle, DialogContentText, DialogActions, Paper  } from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "./Table/TableHeader";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Close } from '@mui/icons-material';
import AmountForm from "../../pages/add_commitmentamount";
import DeleteIcon from '@mui/icons-material/Delete';
import Draggable from "react-draggable";
import InvoiceForm from "./AddInvoice";
import useAxios from "../utils/useAxios";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const headCellsAmounts = [
    {
      id: 'amount',
      numeric: false,
      disablePadding: false,
      label: 'Montant',
    },
    {
      id: 'amount_by_ref_currency',
      numeric: false,
      disablePadding: true,
      label: 'Montant en monnaie de référence ',
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: true,
      label: 'Action'
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
  const {id, convention} = props;
  const axios = useAxios();
  const [commitment, setCommitment] = React.useState({});
  const [contractor, setContractor] = useState({})
  const [value, setValue] = React.useState(0);
  const [invoices, setInvoices] = React.useState([]);
  const [commitmentamounts, setCommitmentamounts] = React.useState([]);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openAmount, setOpenAmount] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [line, setLine] = React.useState(null);
  const [availableCommitsAmount, setAvailableCommitsAmount] = React.useState(0);
  const [availableCommitsAmount1, setAvailableCommitsAmount1] = React.useState(0);
  const router = useRouter()
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { logoutUser } = useContext(AuthContext);

  const getCategoriesCommitmentsAmounts = (categories) => {
    let amount = 0;
    categories ? categories.reduce((commitmentsAmount, c) => {
      return  c.commitments ? c.commitments.reduce((accumulator, e) => {
          return  e.commitmentamounts ? e.commitmentamounts.reduce((accumulator, el) => {
              //console.log(el.amount_by_ref_currency);
              amount = amount+el.amount_by_ref_currency;
              return el; 
            },0) : 0;
        },[]) : [];
    },[]) : []; 
    //console.log("categories comm amount", amount);
    return amount;
  }

  const getCategoriesCommitmentsAmounts1 = (categories) => {
    let amount = 0;
    categories ? categories.reduce((commitmentsAmount, c) => {
      return  c.commitments ? c.commitments.reduce((accumulator, e) => {
          return  e.commitmentamounts ? e.commitmentamounts.reduce((accumulator, el) => {
              //console.log(el.amount_by_ref_currency);
              amount = amount+el.amount;
              return el; 
            },0) : 0; 
        },[]) : [];
    },[]) : []; 
    //console.log("categories comm amount", amount);
    return amount;
  }

  useEffect(() => {
    if(id){ 
      axios.get(`/commitments/${id}`).then(res => {
          setCommitment(res.data)
          setContractor(res.data.contractor)
          setInvoices(res.data.invoices)
          setCommitmentamounts(res.data.commitmentamounts)
      },
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
      )
      if(convention){
        setAvailableCommitsAmount((convention.amount_ref_currency - getCategoriesCommitmentsAmounts(convention.categories)))
        setAvailableCommitsAmount1((convention.amount - getCategoriesCommitmentsAmounts1(convention.categories)))
      }
    }else{
      router.push("/commitments")
    }
  }, [])


  const push = (e) =>{
    axios.get(`/commitments/${id}`).then(res => {
      setCommitment(res.data)
      setContractor(res.data.contractor)
      setInvoices(res.data.invoices)
      setCommitmentamounts(res.data.commitmentamounts)
    } ).then(() => {
      if(convention){
        axios.get(`/conventions/${convention.id}`).then(res => {
            setAvailableCommitsAmount((res.data.amount_ref_currency - getCategoriesCommitmentsAmounts(res.data.categories)))
            setAvailableCommitsAmount1((res.data.amount - getCategoriesCommitmentsAmounts1(res.data.categories)))
          },
          error => {
            console.log(error)
          }
        )
      }
      })
    }

  const update = (e) =>{
    axios.get(`/commitments/${id}`).then(res => {
      setCommitment(res.data)
      setContractor(res.data.contractor)
      setInvoices(res.data.invoices)
      setCommitmentamounts(res.data.commitmentamounts)
    } )
    .then(() => {
      if(convention){
        axios.get(`/conventions/${convention.id}`).then(res => {
          setAvailableCommitsAmount((res.data.amount_ref_currency - getCategoriesCommitmentsAmounts(res.data.categories)))
          setAvailableCommitsAmount1((res.data.amount - getCategoriesCommitmentsAmounts1(res.data.categories)))
        },
        error => {
          console.log(error)
        }
        )
      }

    })
  }

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickOpenAmount = () => {
    setOpenAmount(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpen(false);
    }
  };

  const handleCloseAmount = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenAmount(false);
    }
  };

  const showFailedToast = () => {
    setOpenFailedToast(true);
  };

  const showSuccessToast = () => {
    setOpenSuccessToast(true);
  };

  
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
      axios.delete(`/commitmentamounts/${line.id}`).then(
        res => {
          console.log(res);
          const index = commitmentamounts.indexOf(line);
          commitmentamounts.splice(index, 1);
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
    <BaseCard titleColor={"secondary"} title={commitment.reference}>
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
          <InvoiceForm
            Invoice={null} 
            push={push} 
            update={update}
            showSuccessToast={showSuccessToast}
            showFailedToast={showFailedToast}
            commitmentId = {commitment.id}
          />
        </DialogContent>
      </Dialog>

      <Dialog fullWidth={true} maxWidth={'md'} open={openAmount} onClose={handleCloseAmount}>
        <DialogContent>
          <div style={{display:"flex", justifyContent:"end"}}>
            <IconButton onClick={handleCloseAmount}>
              <Close fontSize='large'/>
            </IconButton>
          </div>
          <AmountForm
            push={push} 
            update={update}
            showSuccessToast={showSuccessToast}
            showFailedToast={showFailedToast}
            commitmentId = {commitment.id}
            availableAmount = {availableCommitsAmount}
            availableAmount1 = {availableCommitsAmount1}
          />
        </DialogContent>
      </Dialog>


      {commitment &&
        <Grid container spacing={2} marginLeft={'15px'}>
            <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                <Typography
                    color="#837B7B"
                    sx={{
                    fontSize: "h4.fontSize",
                    fontStyle:'initial'
                    }}
                >
                    Date début : {formatDate(commitment.start_date)}
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
                    Date fin : {formatDate(commitment.end_date)}
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
                    Date de clôture : {formatDate(commitment.close_date)}
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
                    Statut : {commitment.status}
                </Typography>
            </Grid>
            <Grid item xs={8} sx={{color:"#837B7B", fontWeight: "bold"}} >
                <Typography
                    color="#837B7B"
                    sx={{
                    fontSize: "h4.fontSize",
                    fontStyle:'initial'
                    }}
                >
                    Description : {commitment.description} 
                </Typography>
            </Grid>


    {/*         <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold"}} >
                <Typography
                    color="#837B7B"
                    sx={{
                    fontSize: "h3.fontSize",
                    fontStyle:'initial',
                    fontWeight:"bold"
                    }}
                >
                    Prestateur : {contractor.label}
                </Typography>
            </Grid> */}
            <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                <Typography
                    color="#837B7B"
                    sx={{
                    fontSize: "h4.fontSize",
                    fontStyle:'initial'
                    }}
                >
                    Prestateur : {contractor.label}
                </Typography>
            </Grid>
{/*             <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                <Typography
                    color="#837B7B"
                    sx={{
                    fontSize: "h4.fontSize",
                    fontStyle:'initial'
                    }}
                >
                    Adrésse : {contractor.address}
                </Typography>
            </Grid> */}
            <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                <Typography
                    color="#837B7B"
                    sx={{
                    fontSize: "h4.fontSize",
                    fontStyle:'initial'
                    }}
                >
                    Teléphone : {contractor.telephone}
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
                    Iban : {contractor.iban}
                </Typography>
            </Grid>
        </Grid>
      }


      {commitment &&
          <Grid container 
            sx={{
                mt:"20px",
                mb:"30px"
            }}
          >
            <Grid
                item
                xs={12}
                lg={6}
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
                   width:'60%'
                   }}
                   color={'primary'}
                   onClick={handleClickOpen}
               >
                   + Facture
               </Button> 
       </Grid>

       <Grid
           item
           xs={12}
           lg={6}
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
                   marginInline:"40px",
                   mt: "15px",
                   marginTop:1,
                   width:'60%'
                   }}
                   color={'secondary'}
                   onClick={handleClickOpenAmount}
               >
                   + Montant
               </Button> 
       </Grid>

      </Grid>
      }
      {commitment &&
        <Box sx={{ width: '100%', marginTop:'20px' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs">
                    <Tab style={{fontWeight:'1000', fontSize:'20px'}} label="Les factures d'engagement" {...a11yProps(0)} />
                    <Tab style={{fontWeight:'1000', fontSize:'20px'}} label="Les montants d'engagement" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <CustomTabPanel value={value} index={0}>
              {invoices.length > 0 ?
                <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'medium'}
                >
                <EnhancedTableHead
                    rowCount={invoices.length}
                    headCells={headCells}
                    headerBG="#1A7795"
                    txtColor="#DCDCDC"
                />
                <TableBody>
                    {invoices
                    .map((row, index) => {
                        return (
                        <TableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
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
              :
              <div style={{width: "100%", marginTop: '20px', display: 'flex', justifyContent: "center"}}>
                <Box style={{fontSize: '16px'}}>
                  Liste vide
                </Box>
              </div>
            }
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
            {commitmentamounts.length > 0 ?
                <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={'medium'}
                >
                <EnhancedTableHead
                    rowCount={commitmentamounts.length}
                    headCells={headCellsAmounts}
                    headerBG="#1A7795"
                    txtColor="#DCDCDC"
                />
                <TableBody>
                    {commitmentamounts
                    .map((row, index) => {
                        return (
                        <TableRow
                            hover
                            tabIndex={-1}
                            key={row.id}
                        >
                           
                            <TableCell align="left"></TableCell>
                            <TableCell align="left">{pounds.format(parseFloat(row.amount).toFixed(2))} {row.currency.label} </TableCell>
                            <TableCell align="left">{pounds.format(parseFloat(row.amount_by_ref_currency).toFixed(2))}</TableCell>
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
      }
    </BaseCard>

  );
};

export default DetailCommitment;
