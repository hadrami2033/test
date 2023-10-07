import React from "react";
import { Card, Button, Typography, Snackbar, Alert, CircularProgress, Box, IconButton, Tooltip, MenuItem, Input, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
//import BlogCard from "./BlogCard";
import * as XLSX from 'xlsx/xlsx.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { useRouter } from "next/router";
import Controls from "../controls/Controls";
import useAxios from "../../utils/useAxios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHead from "../Table/TableHeader";
import Select from '@mui/material/Select';
import { ArrowBack, ArrowForward } from "@mui/icons-material";
//import { PieChart } from "@mui/x-charts";
import SearchDD from "../../layouts/header/SearchDD";
import BlogCard from "./BlogCard";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
//import { PieChart } from "@mui/x-charts";
//import Chart from 'react-apexcharts'

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
    id: 'end_date',
    numeric: false,
    disablePadding: false,
    label: 'Date fin',
  }/* ,
  {
    id: 'end_date_grace_period',
    numeric: false,
    disablePadding: false,
    label: 'Fin du grace période',
  } */
  
];

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
// const PieChart = require ("@mui/x-charts")
 
const Dashboard = () => {
  const [loading, setLoading] = React.useState(false);
  const [all, setAll] = React.useState(0);
  const [paidsStatistics, setPaidsStatistics] = React.useState([[], []]);
  const [Conventions, setConventions] = React.useState([])
  const [hasPrevious, setHasPrevious] = React.useState(false);
  const [hasNext, setHasNext] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('amount');
  const [selected, setSelected] = React.useState(null);

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

  const handleSelectSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  const router = useRouter()
  const axios = useAxios();
  const { logoutUser } = useContext(AuthContext);

  React.useEffect(() => {
    axios.get(`/conventions`).then(
      res => {
        console.log(res.data);
        setConventions(res.data);
        setSelected(res.data[0])
      }, 
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
    )
  }, [])


  const optionssalesoverview = {
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        endingShape: "rounded",
        borderRadius: 2,
      },
    },

    colors: ["#fb9678", "#03c9d7"],
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
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
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "ديسمبر",
        "نوفمبر",
        "أكتوبر",
        "سبتمبر",
        "أغسطس",
        "يوليو",
        "يونيو",
        "مايو",
        "أبريل",
        "مارس",
        "فبراير",
        "يناير",
      ],
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
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
    tooltip: {
      theme: "dark",
    },
  };
  const seriessalesoverview = [
    {
      name: " لم يدفعوا  ",
      data: paidsStatistics[1],
    },
    {
      name: " دفعوا  ",
      data: paidsStatistics[0],
    },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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


  const pieParams = { height: 200, margin: { right: 5 } };
  const palette = ['red', 'blue', 'green'];

  return (
    <>
    {loading ? (
      <div 
          style={{
            width:'100%', 
            marginTop:'25%',
            display:'flex',
            justifyContent:'center'
          }} 
        >
      <CircularProgress
          size={60}
          sx={{
            color: 'primary',
          }}
      />
    </div>

      ) : (<>
    <BaseCard titleColor={"secondary"} title={"SOCIETE DE GESTION DE MANANTALI"}>
    {/* {all > 0 ?
      <Chart
        options={optionssalesoverview}
        series={seriessalesoverview}
        type="bar"
        height="295px"
      />
      : */}
        
      <Typography align="center" color={"primary"} fontSize="24px" fontWeight={'600'} variant="h4" mb={5} >
        GESTIONS DES CONVENTIONS DE FINANCEMENT
      </Typography>

      <BlogCard />
    <BaseCard>

    {selected &&
      <Typography align="center" color={"secondary"} fontSize="22px" fontWeight={'600'} variant="h5" mb={1} >
        {selected.object}
      </Typography>
    }
    {selected &&
      <div style={{width:'100%' , display:'flex' , flexDirection:'row', 
      justifyContent:'space-between', paddingLeft: 5, marginBottom: 20 , 
      whiteSpace: "nowrap", overflowX: 'auto', overflowY: 'hidden' }} >
        <Chart
          type="pie"
          width={360}
          /* width={1322}
          height={550} */
          series={[23,43, 50]}
          options={{
            title:{text:"Décaissements"},
            noData:{text:"Empty Data"},
            labels:['Décaissé', 'Non Décaissé', 'Available'],
            fill: {
              type: "solid",
              opacity: 1,
              colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
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
            colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
          }}
        />
        <Chart
          type="pie"
          width={360}
          /* width={1322}
          height={550} */
          series={[23, 43, 50]}
          options={{
            title:{text:"Echeancies"},
            noData:{text:"Empty Data"},
            labels:['Décaissé', 'Non Décaissé', 'Available'],
            fill: {
              type: "solid",
              opacity: 1,
              colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
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
            colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
          }}
        />
        <Chart
          type="pie"
          width={360}
          //height={550} 
          series={[23, 43, 50]}
          options={{
            title:{text:"Catégories"},
            noData:{text:"Empty Data"},
            labels:['Dispatché', 'Non Dispatché', 'Available'],
            fill: {
              type: "solid",
              opacity: 1,
              colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
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
            colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
          }}
        />
      </div>
    }
    
    {Conventions.length > 0 &&
      <Box display="flex" alignItems="center" mb={5} ml={1}>
          <Input placeholder="Cherche une convention ... " aria-label="description" fullWidth color="secondary" />
          <Box
            sx={{
              ml: "auto",
            }}
          >
            <IconButton
              color="inherit"
              sx={{
                color: (theme) => theme.palette.grey.A200,
              }}
              //onClick={handleDrawerClose2}
            >
            </IconButton>
          </Box>
      </Box>
    }
      {Conventions.length > 0 ?
      <TableContainer>
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
                        <TableCell align="left">{formatDate(row.end_date)} </TableCell>


                      </TableRow>
                    );
                  })}
              </TableBody>
        </Table>
      </TableContainer>
      :
      <div style={{width:'100%', fontSize:'20px', display:'flex', justifyContent:'center'}}>
        List de conventons est vide
      </div>
      }
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
    </BaseCard>
    </>
    )
  }
  </>
  );
};

export default Dashboard;
