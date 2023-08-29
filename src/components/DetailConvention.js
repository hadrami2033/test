import React, { useEffect, useState } from "react";
import { Alert, Card, CardContent, Typography, Button, Grid, Tooltip, Stack,Snackbar, Box, Tab ,Tabs, CircularProgress  } from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import apiService from "../services/apiService";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "./Table/TableHeader";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import { Close, CreateOutlined, InfoOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import DisbursementForm from "../../pages/add_disbursement";
import CategorieForm from "../../pages/add_categorie";
import states from "../helper/states";
import DetailDisbursement from "../../pages/disbursement_detail";
import DetailCategorie from "../../pages/categorie_detail";
import DeadlineForm from "../../pages/add_deadline";
import DetailDeadline from "../../pages/deadline_detail";


const headCellsDecaissements = [
    {
      id: 'reference',
      numeric: false,
      disablePadding: false,
      label: 'Référence',
    }, 
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
      label: 'Montant démandé',
    },
    {
      id: 'date',
      numeric: false,
      disablePadding: true,
      label: 'Date création',
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: true,
      label: 'Action',
    }
]

const headCellsCategories = [
   {
     id: 'label',
     numeric: false,
     disablePadding: false,
     label: 'Catégorie',
   },
   {
     id: 'amount',
     numeric: false,
     disablePadding: true,
     label: 'Montant de la catégorie',
   },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: 'Action',
    }
]

const headCellsDeadlines = [
    {
        id: 'label',
        numeric: false,
        disablePadding: true,
        label: 'Label',
      },
    {
      id: 'amount',
      numeric: false,
      disablePadding: false,
      label: 'Montant',
    },

    {
      id: 'order',
      numeric: false,
      disablePadding: true,
      label: 'Order',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: 'Action',
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




const DetailConvention = (props) => {
  const {id} = props;

  const [convention, setConvention] = React.useState(null);
  const [borrower, setBorrower] = useState({})
  const [funder, setFunder] = useState({})
  const [currency, setCurrency] = useState({})
  const [value, setValue] = React.useState(0);
  const [disbursements, setDisbursements] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [deadlines, setDeadlines] = React.useState([]);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDetailDisbursement, setOpenDetailDisbursement] = React.useState(false);
  const [openDetailCategorie, setOpenDetailCategorie] = React.useState(false);
  const [openDetailDeadline, setOpenDetailDeadline] = React.useState(false);
  const [openCategorieForm, setOpenCategorieForm] = React.useState(false);
  const [openDeadlineForm, setOpenDeadlineForm] = React.useState(false);
  const [disburssementSelected, setDisburssementSelected] = React.useState(null);
  const [categorieSelected, setCategorieSelected] = React.useState(null);
  const [deadlineSelected, setDeadlineSelected] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [currenteState, setCurrenteState] = React.useState({});
  const [disbursementStatus, setDisbursementStatus] = React.useState([]);
  const [availabeState, setAvailabeState] = React.useState({});
  const [commitments, setCommitments] = React.useState([]);
  const [invoices, setInvoices] = React.useState([]);
  const [disbursementTypes, setDisbursementTypes] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setLoading(true)
    apiService.getConvention(id).then(res => {
        setConvention(res.data)
        //console.log("disbursements ", res.data.disbursements); 
        setBorrower(res.data.borrower)
        setFunder(res.data.funder)
        setCurrency(res.data.currency)
        setDisbursements(res.data.disbursements)
        setDeadlines(res.data.deadlines)
        setCategories(res.data.categories)
        setLoading(false)
    })
      .then( () => {
        apiService.getStatusType().then(
        res => {
          console.log(res.data);
          setDisbursementStatus(res.data)
        },
        error => console.log(error)
      )
    }
    )
    .then( () => {
        apiService.getDisbursementsTypes().then(
        res => {
          console.log(res.data);
          setDisbursementTypes(res.data)
        },  
        error => console.log(error)
      )
    }
    )
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

  const getDisbursementsAmount = (disbursements) => {
    var sum = disbursements ? disbursements.reduce((accumulator, e) => {
      return accumulator + e.orderamount
    },0) : 0;
    return sum;
  }

  const getCategorieCommitmentsAmounts = (commitments) => {
    let commitmentsAmountArray = []
    //l.reduce
    var ammounts =  commitments ? commitments.reduce((commitmentsAmountConcatinate, c) => {
        var  amountObject =  c.commitmentamounts ? c.commitmentamounts.reduce((accumulator, e) => {
            commitmentsAmountArray.push({...e, commitment: c.reference});
            
            return e; //{...e, commitment: c.reference}
        },{}) : {};
    },[]) : [];

    //console.log(commitmentsAmountArray);       
    return commitmentsAmountArray;
  }

  const getCategorieCommitmentsInvoices = (commitments) => {
    let invoices = []
    var res =  commitments ? commitments.reduce((commitmentsAmountConcatinate, c) => {
        var  invoice =  c.invoices ? c.invoices.reduce((accumulator, e) => {
            var  invoiceline =  e.invoicelines ? e.invoicelines.reduce((accumulator, el) => {
                invoices.push({...el, reference: e.reference, date: e.date, paymentmethod: e.paymentmethod});
                return el; 
            },{}) : {};
        },[]) : [];
    },[]) : []; 
    //console.log(invoices);
    return invoices;
  }

  const getCommitmentsInvoicesAmount = (commitments) => {

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

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setDisburssementSelected(null)
      setOpen(false);
    }
  };

  const handleCloseDetailDisbursement = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenDetailDisbursement(false);
      setDisburssementSelected(null)
    }
  };

  const handleCloseDetailCategorie = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenDetailCategorie(false);
      setCategorieSelected(null)
    }
  };

  const handleCloseDetailDeadline = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenDetailDeadline(false);
      setDeadlineSelected(null)
    }
  };

  const handleCloseCategorie = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenCategorieForm(false);
      setCategorieSelected(null)
    }
  };

  const handleCloseDeadline = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenDeadlineForm(false);
      setDeadlineSelected(null)
    }
  };

  const showFailedToast = () => {
    setOpenFailedToast(true);
  };

  const showSuccessToast = () => {
    setOpenSuccessToast(true);
  };

  const push = (e) =>{
    apiService.getConvention(id).then(res => {
        console.log(res.data); 
        setConvention(res.data)
        setCurrency(res.data.currency)
        setDisbursements(res.data.disbursements)
        setDeadlines(res.data.deadlines)
        setCategories(res.data.categories)
      } )
  }

  const update = (e) =>{
    setDisburssementSelected(null)
    apiService.getConvention(id).then(res => {
        console.log(res.data); 
        setConvention(res.data)
        setCurrency(res.data.currency)
        setDisbursements(res.data.disbursements)
        setDeadlines(res.data.deadlines)
        setCategories(res.data.categories)
      } )
  }

  const openAddDisbursement = () => {
    setOpen(true);
  };
  const openAddCategorie = () => {
    setOpenCategorieForm(true);
  };
  const openAddDeadline = () => {
    setOpenDeadlineForm(true);
  };
  

  const edit = (d) =>{
    setDisburssementSelected(d)
    console.log(d);

    let currente_state = d.status.length > 0 ? 
    getStatusByCode(Math.max(...d.status.map(s => s.type.code)))
    : getStatusByCode(1);
    let available_state = disbursementStatus.filter(e => ( e.code === (currente_state.code+1) || e.code === currente_state.code ));

    console.log("available_state  ",available_state);
    console.log("currente_state  ",currente_state)
    setAvailabeState(available_state)
    setCurrenteState(currente_state);

    let Commitments = d.categorie ?
     convention.categories.filter(e => e.id === d.categorie.id)[0].commitments
     : [];

    let Invoices = d.commitment && Commitments.length > 0 ?
     Commitments.filter(e => e.id === d.commitment.id )[0].invoices
     : [];

    setCommitments(Commitments)
    console.log(Commitments);
    setInvoices(Invoices)

    setOpen(true)
  }

  const detail = (d) =>{
    setDisburssementSelected(d)
    console.log(d.status);
    setOpenDetailDisbursement(true)
  }

  const editCategorie = async (c) =>{
    setCategorieSelected(c)
    setOpenCategorieForm(true)
  }

  const detailCategorie = (c) =>{
    setCategorieSelected(c)
    console.log(getCategorieCommitmentsAmounts(c.commitments));
    console.log(getCategorieCommitmentsInvoices(c.commitments));
    setOpenDetailCategorie(true)
  }

    const editDeadline = async (d) =>{
        setDeadlineSelected(d)
        setOpenDeadlineForm(true)
    }

    const detailDeadline = (d) =>{
        setDeadlineSelected(d)
        setOpenDetailDeadline(true)
    }

  const getStatusByCode = (code) =>{
    if(code){
      let e = disbursementStatus.filter(e => e.code === code );
      return e[0]
    }
    return null;
  }

  return (
    <BaseCard titleColor={"secondary"} title={ convention ? convention.reference : ""}>
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
            {convention &&
            <Dialog fullWidth={true} maxWidth={'lg'} open={open} onClose={handleClose}>
                <DialogContent>
                <div style={{display:"flex", justifyContent:"end"}}>
                    <IconButton onClick={handleClose}>
                    <Close fontSize='medium'/>
                    </IconButton>
                </div>
                <DisbursementForm
                    conventionId = {convention.id}
                    currency = {currency.label}
                    disbursement={disburssementSelected} 
                    currenteState={currenteState}
                    availabeState={availabeState}
                    categories={convention.categories}
                    Commitments={commitments}
                    Invoices={invoices}
                    push={push}
                    update={update}
                    showSuccessToast={showSuccessToast}
                    showFailedToast={showFailedToast}
                    availableAmount={(convention.amount-getDisbursementsAmount(convention.disbursements))}
                /> 
                </DialogContent>
            </Dialog>
            }


            {convention &&
            <Dialog fullWidth={true} maxWidth={'lg'} open={openCategorieForm} onClose={handleCloseCategorie}>
                <DialogContent >
                <div style={{display:"flex", justifyContent:"end"}}>
                    <IconButton onClick={handleCloseCategorie}>
                    <Close fontSize='medium'/>
                    </IconButton>
                </div>
                <CategorieForm
                    conventionId = {convention.id}
                    Categorie={categorieSelected} 
                    push={push} 
                    update={update}
                    showSuccessToast={showSuccessToast}
                    showFailedToast={showFailedToast}
                    availableAmount={(convention.amount-getDisbursementsAmount(convention.disbursements))}
                /> 
                </DialogContent>
            </Dialog>
            }

            {convention &&
            <Dialog fullWidth={true} maxWidth={'lg'} open={openDeadlineForm} onClose={handleCloseDeadline}>
                <DialogContent >
                <div style={{display:"flex", justifyContent:"end"}}>
                    <IconButton onClick={handleCloseDeadline}>
                    <Close fontSize='medium'/>
                    </IconButton>
                </div>
                <DeadlineForm
                    conventionId = {convention.id}
                    deadline={deadlineSelected} 
                    push={push} 
                    update={update}
                    showSuccessToast={showSuccessToast}
                    showFailedToast={showFailedToast}
                    availableAmount={(convention.amount-getDisbursementsAmount(convention.disbursements))}
                /> 
                </DialogContent>
            </Dialog>
            }

            


            {convention &&
            <Dialog 
                fullWidth={true} 
                maxWidth={'lg'} 
                open={openDetailDisbursement} 
                onClose={handleCloseDetailDisbursement}
                
                >
                <DialogContent>
                <Typography style={{display:"flex", justifyContent:"end"}}>
                    <IconButton onClick={handleCloseDetailDisbursement}>
                    <Close fontSize='medium'/>
                    </IconButton>
                </Typography>
                <DetailDisbursement
                    disbursement = {disburssementSelected}
                    disbursementStatus={disbursementStatus} 
                    disbursementtypes={disbursementTypes} 
                    currency={currency.label}
                /> 
                </DialogContent>
            </Dialog>
            }

            {convention &&
            <Dialog 
                fullWidth={true} 
                maxWidth={'lg'} 
                open={openDetailCategorie} 
                onClose={handleCloseDetailCategorie}
                
                >
                <DialogContent>
                <Typography style={{display:"flex", justifyContent:"end"}}>
                    <IconButton onClick={handleCloseDetailCategorie}>
                    <Close fontSize='medium'/>
                    </IconButton>
                </Typography>
                <DetailCategorie
                    categorie = {categorieSelected}
                    categoriecommitmentsamounts={categorieSelected ? getCategorieCommitmentsAmounts(categorieSelected.commitments) : []} 
                    categoriecommitmentsinvoices={categorieSelected ? getCategorieCommitmentsInvoices(categorieSelected.commitments) : []} 
                    currency={currency.label}

                /> 
                </DialogContent>
            </Dialog>
            }


            {convention &&
            <Dialog 
                fullWidth={true} 
                maxWidth={'lg'} 
                open={openDetailDeadline} 
                onClose={handleCloseDetailDeadline}
                
                >
                <DialogContent>
                <Typography style={{display:"flex", justifyContent:"end"}}>
                    <IconButton onClick={handleCloseDetailDeadline}>
                    <Close fontSize='medium'/>
                    </IconButton>
                </Typography>
                <DetailDeadline
                    deadline = {deadlineSelected}
                    currency={currency.label}
                /> 
                </DialogContent>
            </Dialog>
            }

            {convention &&
            <Grid container spacing={2} marginLeft={'15px'}>

                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h3.fontSize",
                                fontWeight: "bold",
                                fontStyle:'initial'
                                }}
                            >
                                Objet : {convention.object}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h3.fontSize",
                                fontWeight: "bold",
                                fontStyle:'initial'
                                }}
                            >
                            Bailleur : {funder.label}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h3.fontSize",
                                fontWeight: "bold",
                                fontStyle:'initial'
                                }}
                            >
                            Montant : {pounds.format(convention.amount)}  {currency.label} 
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
                            Date début : {formatDate(convention.start_date)}
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
                            Date fin : {formatDate(convention.end_date)}
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
                            Date fin de grace periode : {formatDate(convention.end_date_grace_period)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Début de remboursement : {formatDate(convention.start_date_refund)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Fin de remboursement : {formatDate(convention.end_date_refund)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Montant decaissé : {pounds.format(getDisbursementsAmount(convention.disbursements))}
                            </Typography>
                        </Grid>



                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Retrocedé : {retrocede(convention.retrocede)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            {convention.retrocede &&
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial',
                                }}
                            >
                                Commission : {convention.costs}
                            </Typography>
                            }
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Taux d'intéret : {convention.interest_rate}
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Description : {convention.description}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Emprunteur : {borrower.label}
                            </Typography>
                        </Grid>

                        
            </Grid>
            }
            {convention &&
            <Grid container 
                            sx={{
                                mt:"20px",
                                mb:"30px"
                            }}
                        >
                            <Grid
                                item
                                xs={12}
                                lg={4}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"

                                }}
                                >
                                        
                                    <Button
                                        variant="contained"
                                        sx={{
                                        fontSize: "h3.fontSize",
                                        fontWeight: "600",
                                        mt: "15px",
                                        marginInline:"40px",
                                        marginTop:1,
                                        width:'80%'
                                        }}
                                        color={'success'}
                                        onClick={openAddDeadline}
                                    >
                                        + Echéance
                                    </Button> 
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                lg={4}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                >
                                        
                                    <Button
                                        variant="contained"
                                        sx={{
                                        fontSize: "h3.fontSize",
                                        fontWeight: "600",
                                        mt: "15px",
                                        marginInline:"40px",
                                        marginTop:1,
                                        width:'80%'
                                        }}
                                        color={'primary'}
                                        onClick={openAddCategorie}
                                    >
                                        + Catégorie
                                    </Button> 
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                lg={4}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"

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
                                        width:'80%'
                                        }}
                                        color={'secondary'}
                                        onClick={openAddDisbursement}
                                    >
                                        + Décaissement
                                    </Button> 
                            </Grid>

            </Grid>
            }
            {convention &&
            <Box sx={{ width: '100%', marginTop:'15px', marginLeft: '15px' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="tabs">
                            <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Décaissements" {...a11yProps(0)} />
                            <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Catégories de la convention" {...a11yProps(1)} />
                            <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Echéances" {...a11yProps(2)} />
                        </Tabs>
                    </Box>  

                    <CustomTabPanel value={value} index={0}>
                    {disbursements.length > 0 ?
                        <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                            <EnhancedTableHead
                                rowCount={disbursements.length}
                                headCells={headCellsDecaissements}
                                headerBG="#c8d789"
                                txtColor="#000000"
                            />
                            <TableBody>
                                {disbursements
                                .map((row, index) => {
                                    return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={row.id}
                                    >
                                        <TableCell align="left"></TableCell>
                                    
                                        <TableCell align="left">{row.reference}</TableCell>
                                        <TableCell align="left">{row.type.label}</TableCell>
                                        <TableCell align="left">{pounds.format(row.orderamount)} {row.currency.label}</TableCell>
                                        <TableCell align="left">{formatDate(row.date)} </TableCell>
                                        <TableCell align="left">
                                            <Tooltip onClick={() => edit(row)} title="Modifier">
                                                <IconButton>
                                                    <CreateOutlined fontSize='medium' />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip onClick={() => detail(row)} title="Detail">
                                                <IconButton>
                                                    <InfoOutlined color='primary' fontSize='medium' />
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
                    <CustomTabPanel value={value} index={1}>
                    {categories.length > 0 ?
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                            rowCount={categories.length}
                            headCells={headCellsCategories}
                            headerBG="#c8d789"
                            txtColor="#000000"
                        />
                        <TableBody>
                            {categories
                            .map((row, index) => {
                                return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    <TableCell align="left"></TableCell>

                                    <TableCell align="left">{row.type.label} </TableCell>
                                    <TableCell align="left">{pounds.format(row.amount)} {currency.label}</TableCell>
                                    <TableCell align="left">
                                        <Tooltip onClick={() => editCategorie(row)} title="Modifier">
                                            <IconButton>
                                                <CreateOutlined fontSize='medium' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip onClick={() => detailCategorie(row)} title="Detail">
                                            <IconButton>
                                                <InfoOutlined color='primary' fontSize='medium' />
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
                    <CustomTabPanel value={value} index={2}>
                    {deadlines.length > 0 ?
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                            rowCount={deadlines.length}
                            headCells={headCellsDeadlines}
                            headerBG="#c8d789"
                            txtColor="#000000"
                        />
                        <TableBody>
                            {deadlines
                            .map((row, index) => {
                                return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    <TableCell align="left"></TableCell>

                                    <TableCell align="left">{row.label}</TableCell>
                                    <TableCell align="left">{pounds.format(row.amount)} {currency.label}</TableCell>
                                    <TableCell align="left">{row.order} </TableCell>
                                    <TableCell align="left">
                                        <Tooltip onClick={() => editDeadline(row)} title="Modifier">
                                            <IconButton>
                                                <CreateOutlined fontSize='medium' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip onClick={() => detailDeadline(row)} title="Detail">
                                            <IconButton>
                                                <InfoOutlined color='primary' fontSize='medium' />
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

          </Box>
        }
    </BaseCard>

  );
};

export default DetailConvention;
