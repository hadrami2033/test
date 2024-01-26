import { Button, CircularProgress, IconButton, MenuItem, Tooltip } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import * as React from 'react';
import { useEffect } from "react";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "../src/components/Table/TableHeader";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {ArrowBack, ArrowForward } from "@material-ui/icons";
import Select from '@mui/material/Select';
import { Box } from "@material-ui/core";
import EnhancedTableToolbar from "../src/components/Table/TableToolbar";
import useAxios from "../src/utils/useAxios";
import AuthContext from "../src/context/AuthContext";
import { useContext } from "react";
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import fr from "date-fns/locale/fr";
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Stack, } from '@mui/material';
import { Close } from '@mui/icons-material';
import { BsCalendar4Range } from "react-icons/bs";
import Controls from "../src/components/controls/Controls";

const headCells = [
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: "Date d'écheance",
  },
  {
    id: 'reference',
    numeric: false,
    disablePadding: false,
    label: "Référence",
  },
  {
    id: 'convention',
    numeric: false,
    disablePadding: false,
    label: 'Convention',
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
    label: 'Montant total',
  },
  {
    id: 'amount_paid',
    numeric: false,
    disablePadding: false,
    label: 'Montant payé',
  },
  {
    id: 'reste_montant',
    numeric: false,
    disablePadding: false,
    label: 'Montant restant',
  }  
];

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  //onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

EnhancedTableToolbar .propTypes = {
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [Deadlines, setDeadlines] = React.useState([])
  const [hasPrevious, setHasPrevious] = React.useState(false);
  const [hasNext, setHasNext] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [all, setAll] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [valid, setValid] = React.useState(false);
  const [openDate, setOpenDate] = React.useState(false)
  const [date, setDate] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  ])
  const [paymentStatus, setPaymentStatus] = React.useState([]);


  const axios = useAxios();
  const { logoutUser } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true)
    if(selected)
    axios.get(`/deadlines_by_interval/${date[0].startDate.getFullYear()}/${(date[0].startDate.getMonth()+1)}/${date[0].startDate.getDate()}/${date[0].endDate.getFullYear()}/${(date[0].endDate.getMonth()+1)}/${date[0].endDate.getDate()}`).then(
      res => {
        console.log(res.data);
        setDeadlines(res.data.deadlines);
        setCount(res.data.count);
        setAmount(res.data.sum_amount);
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
    else
    axios.get(`/deadlines`).then(
        res => {
          console.log(res.data);
          setDeadlines(res.data.deadlines);
          setCount(res.data.count);
          setAmount(res.data.sum_amount);
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
  }, [valid])
  

  React.useEffect(() => {
    axios.get(`/paymentstatustype`).then(
        res => {
          setPaymentStatus(res.data)
        },
        error => console.log(error)
      )
   }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const next = () => {
    setPageNumber(pageNumber+1)
  }
  const previous = () => {
    setPageNumber(pageNumber-1)
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

    return [ day, month, year].join('-');
  }

  const handleSelectSizeChange = (event) => {
    setPageSize(event.target.value);
  };


  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const changeRefundRangeDate = (val) =>{
    console.log(val);
    setDate(val)
  }

  const handleCloseDate = () => {
    setOpenDate(false)
  }

  const handleOpenDate = () => {
    setOpenDate(true)
    setSelected(true)
  }

  const validSelect = () => {
    handleCloseDate()
    setValid(!valid)
  }



  const deadlineCummulePaymentsRecieved = (deadline) => {
    var recieveds = deadline.deadlinespayments.filter(p => (Math.max(...p.status.map(s => s.type.code)) === Math.max(...paymentStatus.map(t => t.code))) )
    var sum = recieveds ? recieveds.reduce((accumulator, e) => {
        return accumulator + e.amount_ref_currency
      },0) : 0;
      return sum;
  } 

  const deadlinesPaymentsRecievedAmount = () => {
    var sum = Deadlines ? Deadlines.reduce((accumulator, e) => {
        return accumulator + deadlineCummulePaymentsRecieved(e)
      },0) : 0;
    return sum;
  }

  return (<>
    {/* {authenticated &&} */}
    {/* {!detail ? */}
    <BaseCard titleColor={"secondary"} title="GESTION DES DETTES">

        <Dialog maxWidth={'md'} open={openDate} onClose={handleCloseDate}>
            <DialogContent>
            <div style={{display:"flex", justifyContent:"end"}}>
                <IconButton onClick={handleCloseDate}>
                <Close fontSize='medium'/>
                </IconButton>
            </div>
            <div style={{width:'100%', display:'flex', justifyContent:'center'}} className='calendar'>
                <DateRange 
                locale={fr} 
                editableDateInputs={ true } 
                onChange={ (item) => changeRefundRangeDate([item.selection]) } 
                moveRangeOnFirstSelection={ true } 
                ranges={ date } 
                className="date" 
                calendarFocus="forwards"
                /> 
            </div> 
            <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Button
                    type="submit"
                    style={{ fontSize: "20px", borderRadius:"10px", width:'100%' }}
                    variant="contained"
                    mt={4}
                    color="success"
                    onClick={validSelect}
                >
                VALIDER
                </Button>
            </div> 
            </DialogContent>
        </Dialog>

        <Toolbar
            style={{display:"flex", justifyContent: "space-between", marginBottom:30}}
            sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...({
                bgcolor: (theme) =>
                alpha(theme.palette.grey.A100, theme.palette.action.disabledOpacity),
            }),
            }}
        >
            <Stack spacing={2} direction="row">
                <Box style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <Typography
                    align="right"
                    color="secondary"
                    variant="subtitle1"
                    component="div"
                    fontSize={14}
                    fontWeight={'bold'}
                    marginRight="10px"
                    >
                    Montant a payer : {pounds.format(parseFloat(amount-deadlinesPaymentsRecievedAmount()).toFixed(2))} 
                </Typography>
                <Typography
                    align="right"
                    color="secondary"
                    variant="subtitle1"
                    component="div"
                    fontSize={12}
                    fontWeight={'bold'}
                    marginRight="5px"
                >
                  {localStorage.getItem("moneyRef")}
                </Typography>
              </Box>
                <Typography
                    align="right"
                    color="secondary"
                    variant="subtitle1"
                    component="div"
                    fontSize={14}
                    fontWeight={'bold'}
                    marginRight="10px"
                    >
                    Nombre d'écheances : {count}
                </Typography>
            </Stack>

            <Stack spacing={2} direction="row" style={{ width:"50%",display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <Stack style={{display:'flex', flexDirection:'row', alignItems: 'center', justifyContent:'space-between', width:'80%'}}>
                    <Controls.Input
                        style={{width:'50%', marginRight:'10px'}}
                        id="object-input"
                        name="object"
                        label={formatDate(date[0].startDate)}
                        size='small'
                        disabled={true}
                    />
                    -
                    <Controls.Input
                        style={{width:'50%', marginLeft:'10px'}}
                        id="object-input"
                        label={formatDate(date[0].endDate)}
                        size='small'
                        disabled={true}
                    />
                </Stack>
                <IconButton title="Selectionner un intervalle" onClick={() => handleOpenDate() }>
                    <BsCalendar4Range
                        fontSize='30px'
                        color="#1a7795"
                    />
                </IconButton>
            </Stack>

      </Toolbar>



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
          {Deadlines.length > 0 ?
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onSelectAllClick ={null}
                onRequestSort={handleRequestSort}
                rowCount={Deadlines.length}
                headCells={headCells}
                headerBG="#1A7795"
                txtColor="#DCDCDC"
              />
              <TableBody>
                {Deadlines
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell align="left" style={{fontWeight:"bold"}}></TableCell>
                        <TableCell align="left" style={{fontWeight:"bold"}}>{formatDate(row.date)} </TableCell>
                        <TableCell align="left" style={{fontWeight:"bold"}} >{row.reference}</TableCell>
                        <TableCell align="left">{row.convention ? row.convention.reference : null}</TableCell>
                        <TableCell align="left">{( row.convention && row.convention.funder ) ? row.convention.funder.label : null}</TableCell>
                        <TableCell align="left"> <Box style={{display:"flex", flexDirection:"row"}} >  {pounds.format(parseFloat(row.amount_ref_currency).toFixed(2))} <Box style={{fontSize:'12px', fontWeight:"bold", marginInlineStart:"5px", paddingTop:"1.7px" }}> {localStorage.getItem("moneyRef")} </Box> </Box> </TableCell>
                        <TableCell align="left"> <Box style={{display:"flex", flexDirection:"row"}} >{pounds.format(deadlineCummulePaymentsRecieved(row))} <Box style={{fontSize:'12px', fontWeight:"bold", marginInlineStart:"5px" , paddingTop:"1.7px" }}>  {localStorage.getItem("moneyRef")} </Box> </Box> </TableCell>
                        <TableCell align="left"> <Box style={{display:"flex", flexDirection:"row"}} >{pounds.format(row.amount_ref_currency-deadlineCummulePaymentsRecieved(row))} <Box style={{fontSize:'12px', fontWeight:"bold", marginInlineStart:"5px", paddingTop:"1.7px" }}> {localStorage.getItem("moneyRef")} </Box> </Box> </TableCell>
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
          {Deadlines.length > 0 &&
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
    <DetailDeadline clientsCount = {200 } numbersCount = {200 } deadline = {selected} />
    } */}
  </>);
}
