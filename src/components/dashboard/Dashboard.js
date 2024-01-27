import React from "react";
import { CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
import { useRouter } from "next/router";
import useAxios from "../../utils/useAxios";
import BlogCard from "./BlogCard";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import DebtsCard from "./DebtsCard";
import dayjs from "dayjs";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
 
const Dashboard = () => {
  const [loading, setLoading] = React.useState(false);
  const [Conventions, setConventions] = React.useState([])
  const [selected, setSelected] = React.useState(null);
  const [deadlinespayments, setDeadlinespayments] = React.useState([]);
  const [paymentStatus, setPaymentStatus] = React.useState([]);
  const [deadlinesPassed6a3Months, setDeadlinesPassed6a3Months] = React.useState({deadlines:[], sum_amount:0});
  const [deadlinesPassed3a0Months, setDeadlinesPassed3a0Months] = React.useState({deadlines:[], sum_amount:0});
  const [deadlinesAfter0a3Months, setDeadlinesAfter0a3Months] = React.useState({deadlines:[], sum_amount:0});
  const [deadlinesAfter3a6Months, setDeadlinesAfter3a6Months] = React.useState({deadlines:[], sum_amount:0});
  const [maxDeadlineAmount, setMaxDeadlineAmount] = React.useState(0);

  const router = useRouter()
  const axios = useAxios();
  const { logoutUser } = useContext(AuthContext);

  var sixMonthsPassed = dayjs().subtract(6, "months");
  var threeMonthsPassed = dayjs().subtract(3, "months");

  var threeMonthsOneDayPassed = dayjs().subtract(3, "months").add(1, "days");
  var now = dayjs();

  var nowPassedOneDay = dayjs().add(1, "days");
  var threeMonthsAfter = dayjs().add(3, "months");

  var threeMonthsOneAfter = dayjs().add(3, "months").add(1, "days");
  var sixMonthsAfter = dayjs().add(6, "months");

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
    )
    .then(() => {
      axios.get(`/max_intervals_data/${sixMonthsPassed.year()}/${(sixMonthsPassed.month()+1)}/${sixMonthsPassed.date()}/${threeMonthsPassed.year()}/${(threeMonthsPassed.month()+1)}/${threeMonthsPassed.date()}/${threeMonthsOneDayPassed.year()}/${(threeMonthsOneDayPassed.month()+1)}/${threeMonthsOneDayPassed.date()}/${now.year()}/${(now.month()+1)}/${now.date()}/${nowPassedOneDay.year()}/${(nowPassedOneDay.month()+1)}/${nowPassedOneDay.date()}/${threeMonthsAfter.year()}/${(threeMonthsAfter.month()+1)}/${threeMonthsAfter.date()}/${threeMonthsOneAfter.year()}/${(threeMonthsOneAfter.month()+1)}/${threeMonthsOneAfter.date()}/${sixMonthsAfter.year()}/${(sixMonthsAfter.month()+1)}/${sixMonthsAfter.date()}`).then(
        res => {
          setMaxDeadlineAmount(res.data.max_amount)
        }, 
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
        }
      )
    })
    .then(() => {
      axios.get(`/deadlines_by_interval/${sixMonthsPassed.year()}/${(sixMonthsPassed.month()+1)}/${sixMonthsPassed.date()}/${threeMonthsPassed.year()}/${(threeMonthsPassed.month()+1)}/${threeMonthsPassed.date()}`).then(
        res => {
          setDeadlinesPassed6a3Months(res.data);
          //setDeadlines(res.data.deadlines);
          //setCount(res.data.count);
          //setAmount(res.data.sum_amount);
        }, 
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
        }
      )
    })
    .then(() => {
      axios.get(`/deadlines_by_interval/${threeMonthsOneDayPassed.year()}/${(threeMonthsOneDayPassed.month()+1)}/${threeMonthsOneDayPassed.date()}/${now.year()}/${(now.month()+1)}/${now.date()}`).then(
        res => {
          setDeadlinesPassed3a0Months(res.data);
        }, 
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
        }
      )
    })
    .then(() => {
      axios.get(`/deadlines_by_interval/${nowPassedOneDay.year()}/${(nowPassedOneDay.month()+1)}/${nowPassedOneDay.date()}/${threeMonthsAfter.year()}/${(threeMonthsAfter.month()+1)}/${threeMonthsAfter.date()}`).then(
        res => {
          setDeadlinesAfter0a3Months(res.data);
        }, 
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
        }
      )
    })
    .then(() => {
      axios.get(`/deadlines_by_interval/${threeMonthsOneAfter.year()}/${(threeMonthsOneAfter.month()+1)}/${threeMonthsOneAfter.date()}/${sixMonthsAfter.year()}/${(sixMonthsAfter.month()+1)}/${sixMonthsAfter.date()}`).then(
        res => {
          setDeadlinesAfter3a6Months(res.data);
        }, 
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
        }
      )
    }) 
    /* .then(() => {
      setMaxDeadlineAmount(50050)
    }) */
    .then(() => {
      if(!localStorage.getItem("moneyRef"))
      axios.get(`/reference_money`).then(
        res => {
          localStorage.setItem("moneyRef", res.data.length > 0 ? res.data[0].label : null);
        }, 
        error => {
          localStorage.setItem("moneyRef", null);
          console.log(error)
        } 
      )
    })
    .then(() => {
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
    )})    
    .then(() => {
      setLoading(false)
    })
  }, [])



  const getDisbursementsAmount = (disbursements) => {
    var sum = disbursements ? disbursements.reduce((accumulator, e) => {
      return accumulator + e.amount_by_ref_currency
    },0) : 0;
    return sum;
  }



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


  const deadlineCummulPayments = (deadline) => {
    var sum = ( deadline && deadline.deadlinespayments ) ? deadline.deadlinespayments.reduce((accumulator, e) => {
      return accumulator + e.amount_ref_currency
    },0) : 0;
    return sum;
  }

  const deadlinePaymentsAmount = (deadlines) => {
    var sum = deadlines ? deadlines.reduce((accumulator, e) => {
        return accumulator + deadlineCummulPayments(e)
      },0) : 0;
    return sum;
  }

  const deadlineCummulePaymentsRecieved = (deadline) => {
    var recieveds = (deadline && deadline.deadlinespayments && deadline.deadlinespayments.length > 0) ? deadline.deadlinespayments.filter(p => (Math.max(...p.status.map(s => s.type.code)) === Math.max(...paymentStatus.map(t => t.code))) ) : []
    var sum = recieveds ? recieveds.reduce((accumulator, e) => {
        return accumulator + e.amount_ref_currency
    },0) : 0;
    return sum;
  } 

  const deadlinePaymentsRecievedAmount = (deadlines) => {
    var sum = (deadlines && deadlines.length > 0) ? deadlines.reduce((accumulator, e) => {
        return accumulator + deadlineCummulePaymentsRecieved(e)
      },0) : 0;
    return sum;
  }

 
 /*  const optionsdeadlinespayments2 = {
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
        "Echus depuis 6 a 3 mois",
        "Echus depuis 3 a 0 mois",
        "Echus aprés 0 a 3 mois",
        "Echus aprés 3 a 6 mois"
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
      max: Math.max(deadlinesPassed6a3Months.sum_amount, deadlinesPassed3a0Months.sum_amount, deadlinesAfter0a3Months.sum_amount, deadlinesAfter3a6Months.sum_amount),
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
  }; */

  const optionsdeadlinespayments = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true
      }
    },
    colors: ["#cc7c67", "#ecac64", "#079ff0"],
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
        "Echus depuis 6 a 3 mois",
        "Echus depuis 3 a 0 mois",
        "Echus aprés 0 a 3 mois",
        "Echus aprés 3 a 6 mois"
      ],
    },
    yaxis: {
      show: true,
      min: 0, 
      max: maxDeadlineAmount, 
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


  };

  const seriesdeadlinespayments = [
    {
      name: "Dettes non engagées",
      data: [
         (deadlinesPassed6a3Months.sum_amount-deadlinePaymentsAmount(deadlinesPassed6a3Months.deadlines)),
         (deadlinesPassed3a0Months.sum_amount-deadlinePaymentsAmount(deadlinesPassed3a0Months.deadlines)),
         (deadlinesAfter0a3Months.sum_amount-deadlinePaymentsAmount(deadlinesAfter0a3Months.deadlines)),
         (deadlinesAfter3a6Months.sum_amount-deadlinePaymentsAmount(deadlinesAfter3a6Months.deadlines)),
      ],
    },
    {
      name: "Dettes engagées",
      data: [
         (deadlinePaymentsAmount(deadlinesPassed6a3Months.deadlines)-deadlinePaymentsRecievedAmount(deadlinesPassed6a3Months.deadlines)),
         (deadlinePaymentsAmount(deadlinesPassed3a0Months.deadlines)-deadlinePaymentsRecievedAmount(deadlinesPassed3a0Months.deadlines)),
         (deadlinePaymentsAmount(deadlinesAfter0a3Months.deadlines)-deadlinePaymentsRecievedAmount(deadlinesAfter0a3Months.deadlines)),
         (deadlinePaymentsAmount(deadlinesAfter3a6Months.deadlines)-deadlinePaymentsRecievedAmount(deadlinesAfter3a6Months.deadlines)),
      ],
    },
    {
      name: "Dettes payées",
      data: [
         deadlinePaymentsRecievedAmount(deadlinesPassed6a3Months.deadlines),
         deadlinePaymentsRecievedAmount(deadlinesPassed3a0Months.deadlines),
         deadlinePaymentsRecievedAmount(deadlinesAfter0a3Months.deadlines),
         deadlinePaymentsRecievedAmount(deadlinesAfter3a6Months.deadlines)
      ],
    }
  ];

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

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
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
      <DebtsCard paymentStatus = {paymentStatus} paymentsRecievedAmount = {paymentsRecievedAmount()} />

      <BaseCard titleColor={"secondary"} title="EXECUTION GLOBALE DES CONVENTIONS">
        {Conventions.length > 0 ?
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

      <BaseCard titleColor={"secondary"} title="REMBOURSEMENT DE LA DETTE">
        {maxDeadlineAmount > 0  ?
          <Chart
            options={optionsdeadlinespayments}
            series={seriesdeadlinespayments}
            type="bar"
            height="295px"
          />
          :
          <div style={{width:'100%', fontSize:'20px', display:'flex', justifyContent:'center'}}>
            List de conventons est vide
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
