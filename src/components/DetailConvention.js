import React, { useEffect, useState } from "react";
import { Alert, Card, CardContent, Typography, Button, Grid, Tooltip, Stack,Snackbar, Box, Tab ,Tabs, CircularProgress, Fab, Paper  } from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
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
import { Add, Close, CreateOutlined, Delete, InfoOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import DisbursementForm from "../../pages/add_disbursement";
import CategorieForm from "../../pages/add_categorie";
import states from "../helper/states";
import DetailDisbursement from "../../pages/disbursement_detail";
import DetailCategorie from "../../pages/categorie_detail";
import DeadlineForm from "../../pages/add_deadline";
import DetailDeadline from "../../pages/deadline_detail";
import useAxios from "../utils/useAxios";
import { useRouter } from "next/router";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import DetailCommitment from "./DetailCommitment";


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
      id: 'status',
      numeric: false,
      disablePadding: true,
      label: 'État',
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
      id: 'date',
      numeric: false,
      disablePadding: true,
      label: 'Date',
    },
    {
        id: 'reference',
        numeric: false,
        disablePadding: true,
        label: 'Référence',
      },
    {
      id: 'amount',
      numeric: false,
      disablePadding: false,
      label: 'Montant',
    },

    {
      id: 'amount_ref_currency',
      numeric: false,
      disablePadding: false,
      label: 'Montant en monnaie de référence',
    },

    {
      id: 'order',
      numeric: false,
      disablePadding: true,
      label: 'Order',
    },
    {
      id: 'state',
      numeric: false,
      disablePadding: true,
      label: 'État',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: 'Action',
    }
 ]

 const headCellsCommitments = [
  {
    id: 'reference',
    numeric: false,
    disablePadding: true,
    label: 'Reférence',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'start_date',
    numeric: false,
    disablePadding: false,
    label: 'Date début',
  },
  {
    id: 'end_date',
    numeric: false,
    disablePadding: false,
    label: 'Date fin',
  },
  {
    id: 'close_date',
    numeric: false,
    disablePadding: false,
    label: 'Date de Cloture',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: true,
    label: 'Action',
  }
];

const headCellsInvoices = [
  {
    id: 'reference',
    numeric: false,
    disablePadding: true,
    label: 'Reférence',
  },
  {
    id: 'paymentmethod',
    numeric: false,
    disablePadding: false,
    label: 'Mehhode de paiement',
  },
  {
    id: 'paymentreference',
    numeric: false,
    disablePadding: false,
    label: 'Réference de paiement',
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'comment',
    numeric: false,
    disablePadding: false,
    label: 'Commentaire',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: true,
    label: 'Action',
  }
];

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
  const [conventionCommitments, setConventionCommitments] = React.useState([]);
  const [conventionInvoices, setConventionInvoices] = React.useState([]);
  const [disbursementTypes, setDisbursementTypes] = React.useState([]);
  const [openDeleteComm, setOpenDeleteComm] = React.useState(false);
  const [openDeleteInv, setOpenDeleteInv] = React.useState(false);
  const [deleted, setDelete] = React.useState(false);
  const [commToDelete, setCommToDelete] = React.useState(null);
  const [invToDelete, setInvToDelete] = React.useState(null);
  const [openDeleteDeadline, setOpenDeleteDeadline] = React.useState(null);
  const [deadlineToDelete, setDeadlineToDelete] = React.useState(null);
  const [paymentStatus, setPaymentStatus] = React.useState([]);

  const axios = useAxios();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const router = useRouter()
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true)
    let commitementslist = []
    let invoiceslist = []
    if(id){
      axios.get(`/conventions/${id}`).then(res => {
          setConvention(res.data)
          //console.log("disbursements ", res.data.disbursements); 
          setBorrower(res.data.borrower)
          setFunder(res.data.funder)
          setCurrency(res.data.currency)
          setDisbursements(res.data.disbursements)
          setDeadlines(res.data.deadlines)
          setCategories(res.data.categories)
          res.data.categories.map(c => {
            commitementslist = commitementslist.concat(c.commitments)
            c.commitments.map(e => {
              invoiceslist = invoiceslist.concat(e.invoices)
            })
          })
      },
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
      ).then(() => {
        console.log('commitementslist ', commitementslist);
        console.log('invoiceslist ', invoiceslist);
        setConventionCommitments(commitementslist)
        setConventionInvoices(invoiceslist)
        setLoading(false)
      })
        .then(() => {
          axios.get(`/statustype`).then(
          res => {
            console.log(res.data);
            setDisbursementStatus(res.data)
          },
          error => console.log(error)
        )
      }
      )
      .then( () => {
        axios.get(`/disbursementtypes`).then(
          res => {
            console.log(res.data);
            setDisbursementTypes(res.data)
          },  
          error => console.log(error)
        )
      }
      )
      .then(() => {
        axios.get(`/paymentstatustype`).then(
          res => {
            setPaymentStatus(res.data)
          },
          error => console.log(error)
        )
      })
    }else{
      router.push("/conventions")
    }
  }, [])

  const formatDate = (date) => {
    if(date){
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      return [year, month, day].join('-');
    }else return null
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

  const getFirstDisbursementDate = (disbursements) => {
    var first = null;
    var res = disbursements ? disbursements.reduce((accumulator, e) => {
      if(!first || first.date>e.date) {
        first = e
        return e
      }
      else
        return first
    },null) : null;

    if(res && res.date)
    return res.date;
    else
    return null;
  }

  const getDeadlinesAmount = (deadlines) => {
    var sum = deadlines ? deadlines.reduce((accumulator, e) => {
      return accumulator + e.amount
    },0) : 0;
    return sum;
  }

  const getDeadlinesAmountRefCurrency = (deadlines) => {
    var sum = deadlines ? deadlines.reduce((accumulator, e) => {
      return accumulator + e.amount_ref_currency
    },0) : 0;
    return sum;
  }

  const getCategoriesAmount = (deadlines) => {
    var sum = deadlines ? deadlines.reduce((accumulator, e) => {
      return accumulator + e.amount
    },0) : 0;
    return sum;
  }

  const getDisbursementsAmountByMnyRef = (disbursements) => {
    var sum = disbursements ? disbursements.reduce((accumulator, e) => {
      return accumulator + e.amount_by_ref_currency
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
    axios.get(`/conventions/${id}`).then(res => {
        console.log(res.data); 
        setConvention(res.data)
        setCurrency(res.data.currency)
        setDisbursements(res.data.disbursements)
        setDeadlines(res.data.deadlines)
        setCategories(res.data.categories)
        handleClose()
      } )
  }

  const update = (e) =>{
    setDisburssementSelected(null)
    axios.get(`/conventions/${id}`).then(res => {
        console.log(res.data); 
        setConvention(res.data)
        setCurrency(res.data.currency)
        setDisbursements(res.data.disbursements)
        setDeadlines(res.data.deadlines)
        setCategories(res.data.categories)
        handleClose()
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

  const getDisbursementState = (d) => {
    let currente_state = d.status.length > 0 ? 
    getStatusByCode(Math.max(...d.status.map(s => s.type.code)))
    : getStatusByCode(1);

    if(currente_state && currente_state.label)
      return currente_state.label;
    else
      return null;
  }
  

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



  const getStatusByCode = (code) =>{
    if(code){
      let e = disbursementStatus.filter(e => e.code === code );
      return e[0]
    }
    return null;
  }

  const CommitmentDetail = (selected) => {
    //setDetail(true);
    router.push({
      pathname: '/commitment_detail',
      query: { id: selected.id, convention: convention.id }
    })
  }

  const editCommitment = (selected) => {
    console.log("edit => ", selected);
    router.push({
      pathname: '/add_commitment',
      query: { id: selected.id, convention: convention.id }
    })
  }

  const addCommitment = () => {
    router.push({ 
      pathname: '/add_commitment',
      query: { convention: convention.id }
    })
  }

  const detailDeadline = (d) => {
    router.push({ 
      pathname: '/deadline_detail',
      query: { id: d.id, currency: convention.currency.label }
    })
  }

  const handleOpenModalDeleteComm = () =>{
    setOpenDeleteComm(true)
  }

  const handleOpenModalDeleteInv = () =>{
    setOpenDeleteInv(true)
  }

  const deleteClickComm = (row) => {
    setCommToDelete(row)
    handleOpenModalDeleteComm()
  }

  const deleteClickInv = (row) => {
    setInvToDelete(row)
    handleOpenModalDeleteInv()
  }

  const removeCommitment = () =>{
    if(commToDelete !== null){
      axios.delete(`/commitments/${commToDelete.id}`).then(
        res => {
          console.log(res);
          const index = conventionCommitments.indexOf(commToDelete);
          conventionCommitments.splice(index, 1);
          setDelete(!deleted)
          handleCloseModalDeleteComm()
          showSuccessToast()
        },
        error => {
          console.log(error)
          showFailedToast()
        }
      )      
    }
  }


  const removeInvoice = () =>{
    if(invToDelete !== null){
      axios.delete(`/invoices/${invToDelete.id}`).then(
        res => {
          console.log(res);
          const index = conventionInvoices.indexOf(invToDelete);
          conventionInvoices.splice(index, 1);
          setDelete(!deleted)
          handleCloseModalDeleteInv()
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
  const handleCloseModalDeleteComm = () =>{
    setOpenDeleteComm(false)
  }

  const handleCloseModalDeleteInv = () =>{
    setOpenDeleteInv(false)
  }

  const editInvoice = (selected) => {
    console.log("edit => ", selected);
    router.push({
      pathname: '/add_invoice',
      query: { 
        id: selected.id,
        convention: convention.id
       }
    })
  }

  const addInvoice = () => {
    router.push({ pathname: '/add_invoice',
    query: { convention: convention.id }
  })
  }

  const InvoiceDetail = (selected) => {
    router.push({
      pathname: '/invoice_detail',
      query: {id: selected.id}
    })
  }

  const deadlineDatePassed = (d1, d2) => {
    return formatDate(d1)> formatDate(d2);
  }

  const deadlineCummulePayments = (deadline) => {
    var sum = deadline.deadlinespayments ? deadline.deadlinespayments.reduce((accumulator, e) => {
      return accumulator + e.amount
    },0) : 0;
    return sum;
  }

  const allPaymentsRecieved = (deadline) => {
    var recieveds = deadline.deadlinespayments.filter(p => (Math.max(...p.status.map(s => s.type.code)) === Math.max(...paymentStatus.map(t => t.code))) )
    return recieveds.length === deadline.deadlinespayments.length;
  } 

  const deadlineState = (deadline) => {
    let now = new Date().toDateString()
    if( deadlineCummulePayments(deadline) >= deadline.amount && allPaymentsRecieved(deadline) )
      return 1;
    else if(deadlineDatePassed(now, deadline.date))
      return 3;
    else return 2;
  }

  const handleOpenModalDeleteDeadline = () =>{
    setOpenDeleteDeadline(true)
  }

  const handleCloseDeleteDeadline = () =>{
    setOpenDeleteDeadline(false)
  }

  const deleteDeadline = (row) => {
    setDeadlineToDelete(row)
    handleOpenModalDeleteDeadline()
  }

  const confirmDeleteDeadline = () => {
    if(deadlineToDelete !== null){
      axios.delete(`/deadlines/${deadlineToDelete.id}`).then(
        res => {
          console.log(res);
          const index = deadlines.indexOf(deadlineToDelete);
          deadlines.splice(index, 1);
          setDeadlineToDelete(null)
          handleCloseDeleteDeadline()
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

      <Dialog 
        open={openDeleteComm}
        onClose={handleCloseModalDeleteComm}
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
          <Button style={{fontSize:"24px",fontWeight:"bold"}} autoFocus onClick={handleCloseModalDeleteComm}>
            Annuler
          </Button>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} onClick={removeCommitment}>Supprimer</Button>
        </DialogActions>
      </Dialog>


      <Dialog 
        open={openDeleteDeadline}
        onClose={handleCloseDeleteDeadline}
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
          <Button style={{fontSize:"24px",fontWeight:"bold"}} autoFocus onClick={handleCloseDeleteDeadline}>
            Annuler
          </Button>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} onClick={confirmDeleteDeadline}>Supprimer</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openDeleteInv}
        onClose={handleCloseModalDeleteInv}
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
          <Button style={{fontSize:"24px",fontWeight:"bold"}} autoFocus onClick={handleCloseModalDeleteInv}>
            Annuler
          </Button>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} onClick={removeInvoice}>Supprimer</Button>
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
                    availableAmountByMnyRef={(convention.amount_ref_currency-getDisbursementsAmountByMnyRef(convention.disbursements))}
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
                  availableAmount={(convention.amount-getCategoriesAmount(categories))}
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
                    availableAmount={deadlineSelected ? (convention.amount-getDeadlinesAmount(deadlines)+ deadlineSelected.amount) : (convention.amount-getDeadlinesAmount(deadlines))}
                    availableAmountRefCurrency={deadlineSelected ? (convention.amount_ref_currency-getDeadlinesAmountRefCurrency(deadlines)+deadlineSelected.amount_ref_currency) : (convention.amount_ref_currency-getDeadlinesAmountRefCurrency(deadlines))}
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


{/*             {convention &&
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
            } */}

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
                            Date de signature : {formatDate(convention.start_date)}
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
                            Periode de la convention : {convention.convention_periode} mois
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
                            Grace periode : {convention.grace_periode} mois
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
                            Montant disponible : {pounds.format(convention.amount-getDisbursementsAmount(convention.disbursements))} {currency.label} 
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          {getFirstDisbursementDate(convention.disbursements) &&
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Premier décaissement : {formatDate(getFirstDisbursementDate(convention.disbursements))}
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
                            Emprunteur : {borrower.label}
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
                                Commission : {pounds.format(convention.costs)}% 
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
                            Taux d'intéret : {convention.interest_rate}%
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
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


                        
            </Grid>
            }
            {/* {convention &&
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
            } */}
            {convention &&
            <Box sx={{ width: '100%', marginTop:'35px', marginLeft: '15px',
            whiteSpace: "nowrap", overflowX: 'auto', overflowY: 'hidden'
            }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="tabs">
                            <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Décaissements" {...a11yProps(0)} />
                            <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Engagements" {...a11yProps(1)} />
                            <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Factures" {...a11yProps(2)} />
                            <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Catégories de dépense" {...a11yProps(3)} />
                            <Tab style={{fontWeight:'bold', fontSize:'20px'}} label="Echéances" {...a11yProps(4)} />
                        </Tabs>
                    </Box>  

                    <CustomTabPanel value={value} index={0}>
                    <Stack spacing={2} direction="row" mb={2} >
                      <Tooltip title="Ajouter">
                        <Fab color="secondary" size="medium" aria-label="Ajouter" onClick={openAddDisbursement}>
                            <Add/>
                        </Fab>
                      </Tooltip>
                    </Stack>
                    {disbursements.length > 0 ?
                        <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                            <EnhancedTableHead
                                rowCount={disbursements.length}
                                headCells={headCellsDecaissements}
                                headerBG="#1A7795"
                                txtColor="#DCDCDC"
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
                                        <TableCell align="left">{getDisbursementState(row)} </TableCell> 
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
                    <Stack spacing={2} direction="row" mb={2} >
                      <Tooltip title="Ajouter">
                        <Fab color="secondary" size="medium" aria-label="Ajouter" onClick={addCommitment}>
                            <Add/>
                        </Fab>
                      </Tooltip>
                    </Stack>
                    {conventionCommitments.length > 0 ?
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                            rowCount={conventionCommitments.length}
                            headCells={headCellsCommitments}
                            headerBG="#1A7795"
                            txtColor="#DCDCDC"
                        />
                        <TableBody>
                            {conventionCommitments
                            .map((row, index) => {
                                return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    
                                  <TableCell align="left"></TableCell>
                                  <TableCell align="left">{row.reference}</TableCell>
                                  <TableCell align="left">{row.status}</TableCell>
                                  <TableCell align="left">{row.description}</TableCell>
                                  <TableCell align="left">{formatDate(row.start_date)} </TableCell>
                                  <TableCell align="left">{formatDate(row.end_date)} </TableCell>
                                  <TableCell align="left">{formatDate(row.close_date)} </TableCell>

                                  <TableCell align="left">
                                     <Tooltip onClick={() => editCommitment(row)} title="Modifier">
                                         <IconButton>
                                             <CreateOutlined fontSize='medium' />
                                         </IconButton>
                                     </Tooltip>
                                     <Tooltip onClick={() => CommitmentDetail(row)} title="Detail">
                                         <IconButton>
                                             <InfoOutlined color='primary' fontSize='medium' />
                                         </IconButton>
                                     </Tooltip>
                                     <Tooltip onClick={() => deleteClickComm(row)} title="Supprimer">
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
                    <CustomTabPanel value={value} index={2}>
                      <Stack spacing={2} direction="row" mb={2} >
                       <Tooltip title="Ajouter">
                         <Fab color="secondary" size="medium" aria-label="Ajouter" onClick={addInvoice}>
                             <Add/>
                         </Fab>
                       </Tooltip>
                      </Stack>
                    {conventionInvoices.length > 0 ?
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                            rowCount={conventionInvoices.length}
                            headCells={headCellsInvoices}
                            headerBG="#1A7795"
                            txtColor="#DCDCDC"
                        />
                        <TableBody>
                            {conventionInvoices
                            .map((row, index) => {
                                return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    <TableCell align="left"></TableCell>

                                    <TableCell align="left">{row.reference}</TableCell>
                                    <TableCell align="left">{row.paymentmethod}</TableCell>
                                    <TableCell align="left">{row.paymentreference}</TableCell>
                                    <TableCell align="left">{formatDate(row.date)} </TableCell>
                                    <TableCell align="left">{row.comment}</TableCell>
                                    <TableCell align="left">
                                        <Tooltip onClick={() => editInvoice(row)} title="Modifier">
                                            <IconButton>
                                                <CreateOutlined fontSize='medium' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip onClick={() => InvoiceDetail(row)} title="Detail">
                                            <IconButton>
                                                <InfoOutlined color='primary' fontSize='medium' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip onClick={() => deleteClickInv(row)} title="Supprimer">
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
                    <CustomTabPanel value={value} index={3}>
                    <Stack spacing={2} direction="row" mb={2} >
                      <Tooltip title="Ajouter">
                        <Fab color="secondary" size="medium" aria-label="Ajouter" onClick={openAddCategorie}>
                            <Add/>
                        </Fab>
                      </Tooltip>
                    </Stack>
                    {categories.length > 0 ?
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                            rowCount={categories.length}
                            headCells={headCellsCategories}
                            headerBG="#1A7795"
                            txtColor="#DCDCDC"
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
                    <CustomTabPanel value={value} index={4}>
                    <Stack spacing={2} direction="row" mb={2} >
                      <Tooltip title="Ajouter">
                        <Fab color="secondary" size="medium" aria-label="Ajouter" onClick={openAddDeadline}>
                            <Add/>
                        </Fab>
                      </Tooltip>
                    </Stack>
                    {deadlines.length > 0 ?
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                          rowCount={deadlines.length}
                          headCells={headCellsDeadlines}
                          headerBG="#1A7795"
                          txtColor="#DCDCDC"
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

                                    <TableCell align="left">{formatDate(row.date)}</TableCell>
                                    <TableCell align="left">{row.reference}</TableCell>
                                    <TableCell align="left">{pounds.format(row.amount)} {currency.label}</TableCell>
                                    <TableCell align="left">{pounds.format(row.amount_ref_currency)} </TableCell>
                                    <TableCell align="left">{row.order} </TableCell>
                                    <TableCell align="left">
                                       {deadlineState(row) === 1 &&
                                         <Typography
                                           color="#1A7795"
                                         >
                                           Payée
                                         </Typography>
                                       }
                                       {deadlineState(row) === 2 &&
                                         <Typography
                                           color="#837B7B"
                                         >
                                           Non payée
                                         </Typography>
                                       }
                                       {deadlineState(row) === 3 &&
                                         <Typography
                                           color="#e46a76"
                                         >
                                           Date de paiement dépassée
                                         </Typography>
                                       }
                                    </TableCell>
                                    <TableCell align="left">
                                        <Tooltip onClick={() => deleteDeadline(row)} title="Supprimer">
                                            <IconButton>
                                                <Delete color='danger' fontSize='medium' />
                                            </IconButton>
                                        </Tooltip>
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
