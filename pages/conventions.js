import { Alert, Button, CircularProgress, IconButton, MenuItem, Snackbar, Tooltip } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import * as React from 'react';
import { useEffect } from "react";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHead from "../src/components/Table/TableHeader";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import { useRouter } from "next/router";
import {ArrowBack, ArrowForward } from "@material-ui/icons";
import Select from '@mui/material/Select';
import { Box } from "@material-ui/core";
import EnhancedTableToolbar from "../src/components/Table/TableToolbar";
import useAxios from "../src/utils/useAxios";
import AuthContext from "../src/context/AuthContext";
import { useContext } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const headCells = [
  {
    id: 'reference',
    numeric: false,
    disablePadding: false,
    label: 'Reférence',
  },
  {
    id: 'funder',
    numeric: false,
    disablePadding: false,
    label: 'Bailleur',
  },
  {
    id: 'amount',
    numeric: false,
    disablePadding: false,
    label: 'Montant',
  },
  {
    id: 'cummule_dec',
    numeric: false,
    disablePadding: false,
    label: 'Décaissé',
  },
  {
    id: 'reste',
    numeric: false,
    disablePadding: false,
    label: 'Reste',
  },
  {
    id: 'start_date',
    numeric: false,
    disablePadding: false,
    label: 'Date debut',
  },
  {
    id: 'convention_periode',
    numeric: false,
    disablePadding: false,
    label: 'Periode',
  }/* ,
  {
    id: 'end_date_grace_period',
    numeric: false,
    disablePadding: false,
    label: 'Fin du grace période',
  } */
  
];

EnhancedTableHead.propTypes = {
  //numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  //onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

/* EnhancedTableToolbar .propTypes = {
  //selected: PropTypes.number.isRequired,
}; */

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState(null);
  const [Conventions, setConventions] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [getBy, setGetBy] = React.useState("")
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [hasPrevious, setHasPrevious] = React.useState(false);
  const [hasNext, setHasNext] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [all, setAll] = React.useState(0);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deleted, setDelete] = React.useState(false);

  const router = useRouter()
  const axios = useAxios();
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
      //setLoading(true)
      //var cMonth;
      /* apiService.getCurrentMonth().then(
        res => {
          cMonth = res.data
          console.log("current month : ", res.data);
          setCurrentMonth(res.data);
        },
        error => { console.log(error); }
      ).then( () => { */
        //console.log("time : ", cMonth);
        //if(cMonth){
         //if(authTokens){
          //console.log(authTokens);
          setLoading(true)
          axios.get(`/conventions`).then(
            res => {
              console.log(res.data);
              setConventions(res.data);
              //setHasNext(res.data.nextPage);
              //setHasPrevious(res.data.previousPage);
              //setTotalPages(res.data.TotalPages);
              //setAll(res.data.TotalCount);
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
       //}
      
      
    

  }, [pageNumber, pageSize, getBy, deleted])

  /*React.useEffect(() => {
     if(!localStorage.getItem('user')){
      console.log("no user in loc storage :", localStorage.getItem('user'));
      router.push('/login')
    }else{
      console.log("user in loc storage :", localStorage.getItem('user'))
      setAuthenticated(true)
    } 
  }, [])*/

  const showFailedToast = () => {
    setOpenFailedToast(true);
  };

  const showSuccessToast = () => {
    setOpenSuccessToast(true);
  };

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const remove = () =>{
    if(selected !== null){
      axios.delete(`/conventions/${selected.id}`).then(
        res => {
          console.log(res);
          const index = Conventions.indexOf(selected);
          Conventions.splice(index, 1);
          setDelete(!deleted)
          handleCloseModalDelete()
          setSelected(null)
          showSuccessToast()
        },
        error => {
          console.log(error)
          showFailedToast()
        }
      )      
    }
  }

  const handleClick = (event, row) => {
    console.log("select => ", row);
    if(!isSelected(row.id)){
      setSelected(row);
    }else{
      setSelected(null);
    }
  };

  const next = () => {
    setPageNumber(pageNumber+1)
  }
  const previous = () => {
    setPageNumber(pageNumber-1)
  }

  const editClick = () => {
    console.log("edit => ", selected);
    router.push({
      pathname: '/add_convention',
      query: { id: selected.id }
    })
  }

  const addConvention = () => {
    router.push({ pathname: '/add_convention' })
  }

  const deleteClick = () => {
    console.log("delete => ", selected);
    handleOpenModalDelete()
  }

  const shooseField = (field)=> {
    if(selected !== null)
      return selected[field]
    return ""
  }

  const onSearch = e => {
    const { value } = e.target
    setSearch(value)
    if(value === ""){
      setGetBy("")
    }
  }

  const goSearch = () => {
    console.log(search);
    setGetBy(search)
  }

  const isSelected = (id) => {
    console.log("idddd ", id);
    return selected !== null && selected.id === id; //selected.indexOf(id) !== -1;
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

  const handleCloseModalDelete = () =>{
    setOpenDelete(false)
  }

  const handleOpenModalDelete = () =>{
    setOpenDelete(true)
  }

  const handleSelectSizeChange = (event) => {
    return setPageSize(event.target.value);
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

  const conventionDetail = () => {
    //setDetail(true);
    return router.push({
      pathname: '/convention_detail',
      query: { id: selected.id }
    })
  }

  const getDisbursementsAmount = (disbursements) => {
    var sum = disbursements.reduce((accumulator, e) => {
      return accumulator + e.orderamount
    },0);
    return sum;
  }

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const getEcheancesAmount = (echeances) => {
    var sum = echeances.reduce((accumulator, e) => {
      return accumulator + e.amount_ref_currency
    },0);
    return sum;
  }

  const getEcheancePaymentAmounts = (echeances) => {
    let amount = 0;
    echeances ? echeances.reduce((commitmentsAmount, e) => {
      return e.deadlinespayments ? e.deadlinespayments.reduce((accumulator, el) => {
        amount = amount+el.amount_ref_currency;
        return el; 
      },0) : 0;
    },[]) : []; 
    return amount;
  }

  const getCategoriesCommitmentsAmounts = (categories) => {
    let amount = 0;
    categories ? categories.reduce((commitmentsAmount, c) => {
        return c.commitments ? c.commitments.reduce((accumulator, e) => {
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

  return (<>
    {/* {authenticated &&} */}
    {/* {!detail ? */}
    <BaseCard titleColor={"secondary"} title="GESTION DES CONVENTIONS">

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

      {selected &&
      <Box style={{width:'100%' , display:'flex' , flexDirection:'row', 
      justifyContent:'space-between', paddingLeft: 5, marginBottom: 20 , marginTop: 10,
      whiteSpace: "nowrap", overflowX: 'auto', overflowY: 'hidden' }} >
        <Chart
          type="pie"
          width={360}
          /* width={1322}
          height={550} */
          series={[(selected.amount_ref_currency-getDisbursementsAmount(selected.disbursements)),(getDisbursementsAmount(selected.disbursements))]}
          options={{
            title:{text:"Décaissements"},
            noData:{text:"Empty Data"},
            labels:['Non décaissé', 'Décaissé'],
            fill: {
              type: "solid",
              opacity: 1,
              colors: ['#6ebb4b', '#cc7c67']
            },
            chart : {
              offsetX: -15,
              toolbar: {
                show: false,
              },
              foreColor: "#adb0bb",
              fontFamily: "'DM Sans',sans-serif",
              sparkline: {
                enabled: false,
              },
            },
            yaxis: {
              show: true,
              min: 0,
              max: all,
              tickAmount: 5,
              labels: {
                style: {
                  cssClass: "grey--text lighten-2--text fill-color",
                },
              },
            },
            stroke: {
              show: true,
              width: 5,
              lineCap: "butt",
              colors: ["transparent"],
            },
            colors: ['#6ebb4b', '#cc7c67']
          }}
        />
        
        <Chart
          type="pie"
          width={360}
          //height={550} 
          series={[(selected.amount_ref_currency-getCategoriesCommitmentsAmounts(selected.categories)),(getCategoriesCommitmentsAmounts(selected.categories))]}
          options={{
            title:{text:"Engagements"},
            noData:{text:"Empty Data"},
            labels:['Non engagé','Engagé'],
            fill: {
              type: "solid",
              opacity: 1,
              colors: ['#6ebb4b', '#079ff0']
            },
            chart : {
              offsetX: -15,
              toolbar: {
                show: false,
              },
              foreColor: "#adb0bb",
              fontFamily: "'DM Sans',sans-serif",
              sparkline: {
                enabled: false,
              },
            },
            yaxis: {
              show: true,
              min: 0,
              max: all,
              tickAmount: 5,
              labels: {
                style: {
                  cssClass: "grey--text lighten-2--text fill-color",
                },
              },
            },
            stroke: {
              show: true,
              width: 5,
              lineCap: "butt",
              colors: ["transparent"],
            },
            colors: ['#6ebb4b', '#079ff0']
          }}
        />
        {getEcheancesAmount(selected.deadlines) != 0  ?
        <Chart
          type="pie"
          width={360}
          //height={550} 
          series={[(getEcheancesAmount(selected.deadlines) -getEcheancePaymentAmounts(selected.deadlines)),(getEcheancePaymentAmounts(selected.deadlines))]}
          options={{
            title:{text:"Dettes sur convention"},
            noData:{text:"Pas d'écheances sur la convention"},
            labels:['Echus non payé','Echus payé'],
            fill: {
              type: "solid",
              opacity: 1,
              colors: ['#839192', '#079ff0']
            },
            chart : {
              offsetX: -15,
              toolbar: {
                show: false,
              },
              foreColor: "#adb0bb",
              fontFamily: "'DM Sans',sans-serif",
              sparkline: {
                enabled: false,
              },
            },
            yaxis: {
              show: true,
              min: 0,
              max: all,
              tickAmount: 5,
              labels: {
                style: {
                  cssClass: "grey--text lighten-2--text fill-color",
                },
              },
            },
            stroke: {
              show: true,
              width: 5,
              lineCap: "butt",
              colors: ["transparent"],
            },
            colors: ['#839192', '#079ff0']
          }}
        />
        :
        <div style={{width:'100%', height: '80h', fontSize:'16px', display:'flex', justifyContent:'center',
          alignItems:"center", fontWeight:"bold", color:"gray"}}>
          Pas d'écheances sur convention
        </div>
        }
      </Box>
    }
      <EnhancedTableToolbar
        detail = {conventionDetail}
        field = {shooseField("object")} 
        selected = {selected}
        deleteClick = {deleteClick}
        editClick = {editClick}
        onSearch = {onSearch}
        search = {search}
        openModal = {addConvention}
        goSearch = {goSearch}
      />
      <TableContainer>
       
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
          <>
          {Conventions.length > 0 ?
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                selected={selected}
                order={order}
                orderBy={orderBy}
                onSelectAllClick ={null}
                onRequestSort={handleRequestSort}
                rowCount={Conventions.length}
                headCells={headCells}
                headerBG="#1A7795"
                txtColor="#DCDCDC"
              />
              <TableBody>
                {Conventions
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        //aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        //selected={isItemSelected}
                      >
                        
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="secondary"
                            checked={isItemSelected}
                            inputProps={{ 
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell align="left" style={{fontWeight:"bold"}} >{row.reference}</TableCell>
                        <TableCell align="left">{row.funder.label}</TableCell>
                        <TableCell align="left"> <Box style={{display:"flex", flexDirection:"row"}} >  {pounds.format(parseFloat(row.amount).toFixed(2))} <Box style={{fontSize:'12px', fontWeight:"bold", marginInlineStart:"5px", paddingTop:"1.7px" }}>  {row.currency.label}</Box> </Box> </TableCell>
                        <TableCell align="left"> <Box style={{display:"flex", flexDirection:"row"}} >{pounds.format(getDisbursementsAmount(row.disbursements))} <Box style={{fontSize:'12px', fontWeight:"bold", marginInlineStart:"5px" , paddingTop:"1.7px" }}>  {row.currency.label}</Box> </Box> </TableCell>
                        <TableCell align="left"> <Box style={{display:"flex", flexDirection:"row"}} >{pounds.format(row.amount-getDisbursementsAmount(row.disbursements))} <Box style={{fontSize:'12px', fontWeight:"bold", marginInlineStart:"5px", paddingTop:"1.7px" }}>  {row.currency.label}</Box> </Box> </TableCell>
                        <TableCell align="left">{formatDate(row.start_date)} </TableCell>
                        <TableCell align="left">{row.convention_periode} mois </TableCell>


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
          </>
        }
      </TableContainer>
      {Conventions.length > 0 &&
       <div style={{width: "100%", marginTop: '20px', display: 'flex', justifyContent: "space-between"}}>
            <div style={{width:"50%", display:'flex', alignItems:'center'}}>
              <Box style={{display:'flex', alignItems:'center', marginInline:"20px", fontWeight:'bold', color:"GrayText"}} >
              Total : {all}
              </Box>
            </div>
            <div style={{width:"50%", display:'flex', alignItems:'center', justifyContent:"end"}}>
              <Box style={{display:'flex', alignItems:'center', marginInline:"20px", fontWeight:'normal', color:"GrayText"}} >
                {pageNumber}/{totalPages}
              </Box>

              <Tooltip title="Précédente">
               <span>
                <IconButton disabled={!hasPrevious} onClick={previous}>
                  <ArrowBack/>
                </IconButton>
                </span>
              </Tooltip>

              <Select
                id="page-size-select"
                value={pageSize}
                onChange={handleSelectSizeChange }
                label="pageSize"
              >
                <MenuItem value={pageSize}>
                  <em>{pageSize}</em>
                </MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>  

              <Tooltip title="Suivante">
                <span>
                <IconButton disabled={!hasNext} onClick={next} >
                  <ArrowForward/>
                </IconButton>
                </span>
              </Tooltip>
            </div>
       </div>
      }
    </BaseCard>
    {/* :
    <DetailConvention clientsCount = {200 } numbersCount = {200 } convention = {selected} />
    } */}
  </>);
}
