import React, { useContext } from "react";
import { Card, CardContent, Typography, Button, Grid, Tooltip, Stack, Box } from "@mui/material";
import { FaHandshake } from 'react-icons/fa';
import { GiMoneyStack, GiPayMoney, GiReceiveMoney } from 'react-icons/gi';
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
import { LuTimerOff } from "react-icons/lu";
import { RiLoader4Fill } from "react-icons/ri";
import { TbTimeline } from "react-icons/tb";


const DebtsCard = (props) => {
  const {paymentsRecievedAmount, paymentStatus} = props;
  //colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
  const { logoutUser } = useContext(AuthContext);

  const [expiredDeadlines, setExpiredDeadlines] = React.useState([]);
  const [expiredDeadlinesAmount, setExpiredDeadlinesAmount] = React.useState(null);
  const [countDiss, setCountDiss] = React.useState(null);
  const [countComm, setCountComm] = React.useState(null);
  const [amountConv, setAmountConv] = React.useState(null);
  const [amountDiss, setAmountDiss] = React.useState(null);
  const [amountComm, setAmountComm] = React.useState(null);
  const [amountDeadlines, setAmountDeadlines] = React.useState(null);
  const axios = useAxios();

  React.useEffect(() => {
    const now_date = new Date();
    axios.get(
      `/deadlines_expired/${now_date.getFullYear()}/${(now_date.getMonth()+1)}/${now_date.getDate()}`).then(
      res => {
        console.log(res.data);
        setExpiredDeadlines(res.data.deadlines_expired);
        setExpiredDeadlinesAmount(res.data.sum_amount);
      }, 
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
    ).then(
      axios.get(`/deadlines_amount`).then(
        res => {
          setAmountDeadlines(res.data.sum_amount);
        }, 
        error => {
          console.log(error)
        }
      )
    )
  }, [])

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const deadlineCummulePayments = (deadline) => {
    var sum = deadline.deadlinespayments ? deadline.deadlinespayments.reduce((accumulator, e) => {
      return accumulator + e.amount_ref_currency
    },0) : 0;
    return sum;
  }

  const expiredDeadlinePaymentsAmount = () => {
    var sum = expiredDeadlines ? expiredDeadlines.reduce((accumulator, e) => {
        return accumulator + deadlineCummulePayments(e)
      },0) : 0;
    return sum;
  }

  const deadlineCummulePaymentsRecieved = (deadline) => {
    var recieveds = deadline.deadlinespayments.filter(p => (Math.max(...p.status.map(s => s.type.code)) === Math.max(...paymentStatus.map(t => t.code))) )
    var sum = recieveds ? recieveds.reduce((accumulator, e) => {
        return accumulator + e.amount_ref_currency
      },0) : 0;
      return sum;
  } 

  const expiredDeadlinePaymentsRecievedAmount = () => {
    var sum = expiredDeadlines ? expiredDeadlines.reduce((accumulator, e) => {
        return accumulator + deadlineCummulePaymentsRecieved(e)
      },0) : 0;
    return sum;
  }

  return (
    <Grid container>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Card
            sx={{
              p: 0,
              width: "100%",
              boxShadow:3,
              bgcolor:'#839192'
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >  

            <Box style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
              <GiMoneyStack 
                fontSize='30px'
                color='white'
              />
              
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h5.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center',
                  marginInlineStart: "10px"
                }}
              >
                Dette global
              </Typography>
              </Box>
              <Box style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>

              <Typography
                //color="primary"
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "1000",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                {pounds.format(amountDeadlines-paymentsRecievedAmount)}
              </Typography>
              <Typography
                  //color="primary"
                  color={"#F6EEFA"}
                  sx={{
                    fontSize: "h6.fontSize",
                    fontWeight: "1000",
                    marginTop:1,
                    display:'flex', 
                    marginInlineStart:'5px',
                    justifyContent: 'center',
                  }}
                >
                  {localStorage.getItem("moneyRef")}
                </Typography>
              </Box>
            </CardContent>
          </Card>

        </Grid>
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Card
            sx={{
              p: 0,
              width: "100%",
              boxShadow:3,
              bgcolor:'#cc7c67',
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >

            <Box style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                  <LuTimerOff  
                        color="white"                     
                        fontSize='30px'
                      />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h5.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center',
                  marginInlineStart: "10px"
                }}
              >
                Dette échus non engagé
              </Typography>
            </Box>
            <Box style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>

              <Typography
                //color="primary"
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "1000",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                {pounds.format(expiredDeadlinesAmount - expiredDeadlinePaymentsAmount()) } 
              </Typography>
              <Typography
                  //color="primary"
                  color={"#F6EEFA"}
                  sx={{
                    fontSize: "h6.fontSize",
                    fontWeight: "1000",
                    marginTop:1,
                    display:'flex', 
                    marginInlineStart:'5px',
                    justifyContent: 'center',
                  }}
                >
                  {localStorage.getItem("moneyRef")}
                </Typography>
              </Box>
            </CardContent>
          </Card>

        </Grid>

        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Card
            sx={{
              p: 0,
              width: "100%",
              boxShadow:3,
              bgcolor:'#ecac64'
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >  
            <Box style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
              <TbTimeline 
                    fontSize='30px'
                    style={{
                      color: "white",
                    }}                      
              />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h5.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center',
                  marginInlineStart: "10px"
                }}
              >
                Dette échus engagé
              </Typography>
            </Box>
            <Box style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>

              <Typography
                //color="primary"
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "1000",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                {pounds.format(expiredDeadlinePaymentsAmount() - expiredDeadlinePaymentsRecievedAmount() )} 
              </Typography>
              <Typography
                  //color="primary"
                  color={"#F6EEFA"}
                  sx={{
                    fontSize: "h6.fontSize",
                    fontWeight: "1000",
                    marginTop:1,
                    display:'flex', 
                    marginInlineStart:'5px',
                    justifyContent: 'center',
                  }}
                >
                  {localStorage.getItem("moneyRef")}
                </Typography>
              </Box>
            </CardContent>
          </Card>

        </Grid>

    </Grid>
  );
};

export default DebtsCard;
