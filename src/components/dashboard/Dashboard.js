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
  const [deadlinespayments, setDeadlinespayments] = React.useState([]);
  const [paymentStatus, setPaymentStatus] = React.useState([]);

  const handleClick = (event, row) => {
    console.log("select => ", row);
    console.log(" passed less than 50% and 75% ", getConventionsHasDissLess25pourcentAndDeadlinePassedBetween25and50pourcent()); 
    console.log(getCategoriesCommitmentsAmounts(row.categories))
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
    const sogemvalue ={
      code: "001",
      label: "SOGEM",
      country: "sogem",
      description: "sogem"
    }
    setLoading(true)
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
    ).then(() => {
      axios.get(`/borrowers`).then(
        res => {
          const sogem = res.data.filter(e => e.label === "SOGEM" )
          if(sogem.length === 0){
            axios.post(`/borrowers`,sogemvalue).then(
              (res) => {
                console.log("added => " ,res);
              },
              (error) => {
                console.log(error);
              } )
          }
        }, 
        error => {
          console.log(error)
        }
      )
    })
    .then(() => {
      axios.get(`/deadlinepayments`).then(res => {
        console.log("deadlinepayments ++++ ", res.data);
        setDeadlinespayments(res.data)
      },
      error => {
        console.log(error)
      })
    })
    .then(() => {
      axios.get(`/paymentstatustype`).then(
        res => {
          setPaymentStatus(res.data)
        },
        error => console.log(error)
      )    })    
    .then(() => {
      setLoading(false)
    })
  }, [])




  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getDisbursementsAmount = (disbursements) => {
    var sum = disbursements.reduce((accumulator, e) => {
      return accumulator + e.amount_by_ref_currency
    },0);
    return sum;
  }

  const getEcheancesAmount = (echeances) => {
    var sum = echeances.reduce((accumulator, e) => {
      return accumulator + e.amount_ref_currency
    },0);
    return sum;
  }

  const getEcheancePaymentAmounts = (echeances) => {
    let amount = 0;
    echeances ? echeances.reduce((commitmentsAmount, e) => {
      e.deadlinespayments ? e.deadlinespayments.reduce((accumulator, el) => {
        amount = amount+el.amount_ref_currency;
        return el; 
      },0) : 0;
    },[]) : []; 
    return amount;
}

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });


  /* const getCategorieCommitmentsAmounts = (commitments) => {
    let commitmentsAmountArray = []
    //l.reduce
    var ammounts =  commitments ? commitments.reduce((commitmentsAmountConcatinate, c) => {
        var  amountObject =  c.commitmentamounts ? c.commitmentamounts.reduce((accumulator, e) => {
            commitmentsAmountArray.push({...e, commitment: c.reference});
            
            return e; //{...e, commitment: c.reference}
        },{}) : {};
    },[]) : [];

    var sum = disbursements ? disbursements.reduce((accumulator, e) => {
      return accumulator + e.orderamount
    },0) : 0;
    return sum;

    //console.log(commitmentsAmountArray);       
    return commitmentsAmountArray;
  } */

  const getCategoriesCommitmentsAmounts = (categories) => {
      let amount = 0;
      categories ? categories.reduce((commitmentsAmount, c) => {
          c.commitments ? c.commitments.reduce((accumulator, e) => {
              e.commitmentamounts ? e.commitmentamounts.reduce((accumulator, el) => {
                //console.log(el.amount_by_ref_currency);
                amount = amount+el.amount_by_ref_currency;
                return el; 
              },0) : 0;
          },[]) : [];
      },[]) : []; 
      //console.log("categories comm amount", amount);
      return amount;
  }

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  const getConventionsHasDissLess25pourcentDeadlinePassedLessThan25pourcent = () => {
    const res = Conventions.filter(e => ( 
      ((e.amount_ref_currency*0.25) >= (getDisbursementsAmount(e.disbursements)))
      && ((e.convention_periode*0.25) >= (monthDiff( new Date(e.start_date), new Date())))
      )
    )
    return res
  }

  const getConventionsHasDissBetween25and50pourcentAndDeadlinePassedLessThan25pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.25) < getDisbursementsAmount(e.disbursements)) 
      && ((getDisbursementsAmount(e.disbursements)) <= (e.amount_ref_currency*0.5) ) 
      && ((e.convention_periode*0.25) >= (monthDiff( new Date(e.start_date), new Date())))
      ) 
    
    )
    return res
  }

  const getConventionsHasDissBetween50and75pourcentAndDeadlinePassedLessThan25pourcent = () => {
    const res = Conventions.filter(e => ( (((e.amount_ref_currency*0.5) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= (e.amount_ref_currency*0.75) ) ) 
    && ((e.convention_periode*0.25) >= (monthDiff( new Date(e.start_date), new Date())))
    ) )
    return res
  }

  const getConventionsHasDissBetween75and100pourcentAndDeadlinePassedLessThan25pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.75) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= e.amount_ref_currency )
    && ((e.convention_periode*0.25) >= (monthDiff( new Date(e.start_date), new Date())))
    ) )
    return res
  }


  const getConventionsHasDissLess25pourcentAndDeadlinePassedBetween25and50pourcent = () => {
    const res = Conventions.filter(e =>  ( 
        ((e.amount_ref_currency*0.25) >= (getDisbursementsAmount(e.disbursements)))
        && ( ((e.convention_periode*0.25) < monthDiff( new Date(e.start_date), new Date())) 
             && (monthDiff( new Date(e.start_date), new Date()) <= (e.convention_periode*0.5)) )
      )
    )
    return res
  }

  const getConventionsHasDissBetween25and50pourcentAndDeadlinePassedBetween25and50pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.25) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= (e.amount_ref_currency*0.5) ) 
    && ( ((e.convention_periode*0.25) < monthDiff( new Date(e.start_date), new Date())) 
      && (monthDiff( new Date(e.start_date), new Date()) <= (e.convention_periode*0.5)) )
    ) 
    
    )
    return res
  }

  const getConventionsHasDissBetween50and75pourcentAndDeadlinePassedBetween25and50pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.5) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= (e.amount_ref_currency*0.75) ) 
    && ( ((e.convention_periode*0.25) < monthDiff( new Date(e.start_date), new Date())) 
      && (monthDiff( new Date(e.start_date), new Date()) <= (e.convention_periode*0.5)) )
    ) )
    return res
  }

  const getConventionsHasDissBetween75and100pourcentAndDeadlinePassedBetween25and50pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.75) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= e.amount_ref_currency )
    && ( ((e.convention_periode*0.25) < monthDiff( new Date(e.start_date), new Date())) 
      && (monthDiff( new Date(e.start_date), new Date()) <= (e.convention_periode*0.5)) )
    ) )
    return res
  }

  const getConventionsHasDissLess25pourcentAndDeadlinePassedBetween50and75pourcent = () => {
    const res = Conventions.filter(e =>  ( 
      ((e.amount_ref_currency*0.25) >= (getDisbursementsAmount(e.disbursements)))
      && ( ((e.convention_periode*0.5) < monthDiff( new Date(e.start_date), new Date())) 
      && (monthDiff( new Date(e.start_date), new Date()) <= (e.convention_periode*0.75)) )
      )
    )
    return res
  }

  const getConventionsHasDissBetween25and50pourcentAndDeadlinePassedBetween50and75pourcent = () => {
    const res = Conventions.filter(e => ( (((e.amount_ref_currency*0.25) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= (e.amount_ref_currency*0.5) ))
    && ( ((e.convention_periode*0.5) < monthDiff( new Date(e.start_date), new Date())) 
    && (monthDiff( new Date(e.start_date), new Date()) <= (e.convention_periode*0.75)) )
    ) 
    
    )
    return res
  }

  const getConventionsHasDissBetween50and75pourcentAndDeadlinePassedBetween50and75pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.5) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= (e.amount_ref_currency*0.75) ) 
    && ( ((e.convention_periode*0.5) < monthDiff( new Date(e.start_date), new Date())) 
    && (monthDiff( new Date(e.start_date), new Date()) <= (e.convention_periode*0.75)) )
    ) )
    return res
  }

  const getConventionsHasDissBetween75and100pourcentAndDeadlinePassedBetween50and75pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.75) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= e.amount_ref_currency )
    && ( ((e.convention_periode*0.5) < monthDiff( new Date(e.start_date), new Date())) 
    && (monthDiff( new Date(e.start_date), new Date()) <= (e.convention_periode*0.75)) )
    ) )
    return res
  }


  const getConventionsHasDissLess25pourcentAndDeadlinePassedBetween75and100pourcent = () => {
    const res = Conventions.filter(e =>  ( 
      ((e.amount_ref_currency*0.25) >= (getDisbursementsAmount(e.disbursements)))
      && ((e.convention_periode*0.75) < monthDiff( new Date(e.start_date), new Date()))
      )
    )
    return res
  }

  const getConventionsHasDissBetween25and50pourcentAndDeadlinePassedBetween75and100pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.25) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= (e.amount_ref_currency*0.5) ) 
    && ((e.convention_periode*0.75) < monthDiff( new Date(e.start_date), new Date()))
    ) 
    
    )
    return res
  }

  const getConventionsHasDissBetween50and75pourcentAndDeadlinePassedBetween75and100pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.5) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= (e.amount_ref_currency*0.75) ) 
    && ((e.convention_periode*0.75) < monthDiff( new Date(e.start_date), new Date()))
    ) )
    return res
  }

  const getConventionsHasDissBetween75and100pourcentAndDeadlinePassedBetween75and100pourcent = () => {
    const res = Conventions.filter(e => ( ((e.amount_ref_currency*0.75) < getDisbursementsAmount(e.disbursements)) 
    && ((getDisbursementsAmount(e.disbursements)) <= e.amount_ref_currency )
    && ((e.convention_periode*0.75) < monthDiff( new Date(e.start_date), new Date()))
    ) )
    return res
  }


  const options2 = {
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
        borderRadius: 5,
      },
    },

    colors: ["#6ebb4b", "#079ff0", "#cc7c67", "#1a7795"],
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
        "Durée passée moins de 25%",
        "Durée passée entre 25% et 50%",
        "Durée passée entre 50% et 75%",
        "Durée passée plus de 75%"
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
      max: Conventions.length,
      tickAmount: 3,
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


  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    colors: ["#6ebb4b", "#079ff0", "#cc7c67", "#1a7795"],
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    xaxis: {
      //type: 'datetime',
      categories: [
        "Durée passée moins de 25%",
        "Durée passée entre 25% et 50%",
        "Durée passée entre 50% et 75%",
        "Durée passée plus de 75%"
      ],
    },
    yaxis: {
      show: true,
      min: 0,
      max: Conventions.length,
      tickAmount: 3,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  }


  const seriesdeadlinesdissburssements = [
    {
      name: "Décaissement inferieur de 25%",
      data: [
        getConventionsHasDissLess25pourcentDeadlinePassedLessThan25pourcent().length,
        getConventionsHasDissLess25pourcentAndDeadlinePassedBetween25and50pourcent().length,
        getConventionsHasDissLess25pourcentAndDeadlinePassedBetween50and75pourcent().length,
        getConventionsHasDissLess25pourcentAndDeadlinePassedBetween75and100pourcent().length
      ],
    },
    {
      name: "Décaissement entre 25% et 50%",
      data: [
        getConventionsHasDissBetween25and50pourcentAndDeadlinePassedLessThan25pourcent().length,
        getConventionsHasDissBetween25and50pourcentAndDeadlinePassedBetween25and50pourcent().length,
        getConventionsHasDissBetween25and50pourcentAndDeadlinePassedBetween50and75pourcent().length,
        getConventionsHasDissBetween25and50pourcentAndDeadlinePassedBetween75and100pourcent().length
      ],
    },
    {
      name: "Décaissement entre 50% et 75%",
      data: [
        getConventionsHasDissBetween50and75pourcentAndDeadlinePassedLessThan25pourcent().length,
        getConventionsHasDissBetween50and75pourcentAndDeadlinePassedBetween25and50pourcent().length,
        getConventionsHasDissBetween50and75pourcentAndDeadlinePassedBetween50and75pourcent().length,
        getConventionsHasDissBetween50and75pourcentAndDeadlinePassedBetween75and100pourcent().length,
      ],
    },
    {
      name: "Décaissement superieur de 75%",
      data: [
        getConventionsHasDissBetween75and100pourcentAndDeadlinePassedLessThan25pourcent().length,
        getConventionsHasDissBetween75and100pourcentAndDeadlinePassedBetween25and50pourcent().length,
        getConventionsHasDissBetween75and100pourcentAndDeadlinePassedBetween50and75pourcent.length,
        getConventionsHasDissBetween75and100pourcentAndDeadlinePassedBetween75and100pourcent().length
      ],
    },
  ];

  const pieParams = { height: 200, margin: { right: 5 } };
  const palette = ['red', 'blue', 'green'];


  const deadlineCummulePayments = (payments) => {
    var sum = payments ? payments.reduce((accumulator, e) => {
      return accumulator + e.amount_ref_currency
    },0) : 0;
    return sum;
  }

  const paymentsRecievedAmount = () => {
    console.log("paymentStatus , " , paymentStatus);
    var recieveds = deadlinespayments.filter(p => (Math.max(...p.status.map(s => s.type.code)) === Math.max(...paymentStatus.map(t => t.code))) )
    return deadlineCummulePayments(recieveds);
  } 

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
    <BaseCard titleColor={"secondary"} title={"GESTIONS DES CONVENTIONS DE FINANCEMENT"}>
    {/* {all > 0 ?
      <Chart
        options={optionssalesoverview}
        series={seriessalesoverview}
        type="bar"
        height="295px"
      />
      : */}
        
     {/*  <Typography align="center" color={"primary"} fontSize="24px" fontWeight={'600'} variant="h4" mb={5} >
        GESTIONS DES CONVENTIONS DE FINANCEMENT
      </Typography> */}

      <BlogCard paymentsRecievedAmount = {paymentsRecievedAmount()} />

      <BaseCard titleColor={"secondary"} title="EXECUTION GLOBAL">
        {Conventions.length > 0 > 0 ?
          <Chart
            options={options}
            series={seriesdeadlinesdissburssements}
            type="bar"
            height="295px"
          />
          :
          <div style={{width:'100%', fontSize:'20px', display:'flex', justifyContent:'center'}}>
            List de conventons est vide
          </div>
        } 
      </BaseCard>


    <BaseCard titleColor={"secondary"} title={ selected ? selected.object : null}>

    {/* {selected &&
      <Typography align="center" color={"secondary"} fontSize="22px" fontWeight={'600'} variant="h5" mb={1} >
        {selected.object}
      </Typography>
    } */}
    {selected &&
      <div style={{width:'100%' , display:'flex' , flexDirection:'row', 
      justifyContent:'space-around', paddingLeft: 5, marginBottom: 20 , marginTop: 10,
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
            labels:['Non Engagé','Engagé'],
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
        {getEcheancesAmount(selected.deadlines) != 0  &&
        <Chart
          type="pie"
          width={360}
          //height={550} 
          series={[(getEcheancesAmount(selected.deadlines) -getEcheancePaymentAmounts(selected.deadlines)),(getEcheancePaymentAmounts(selected.deadlines))]}
          options={{
            title:{text:"Dettes sur convention"},
            noData:{text:"Empty Data"},
            labels:['Non Payé','Payé'],
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
        }
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
                        <TableCell align="left"> <Box style={{display:"flex", flexDirection:"row"}} >  {pounds.format(parseFloat(row.amount_ref_currency).toFixed(2))} </Box> </TableCell>
                        <TableCell align="left">{formatDate(row.start_date)} </TableCell>
                        <TableCell align="left">{row.convention_periode} mois </TableCell>


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
