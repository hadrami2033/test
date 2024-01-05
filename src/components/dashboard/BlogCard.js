import React, { useContext } from "react";
import { Card, CardContent, Typography, Button, Grid, Tooltip, Stack, Box } from "@mui/material";
import { FaHandshake } from 'react-icons/fa';
import { GiMoneyStack, GiPayMoney, GiReceiveMoney } from 'react-icons/gi';
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";

const BlogCard = (props) => {
  const {paymentsRecievedAmount} = props;
  //colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
  const { logoutUser } = useContext(AuthContext);

  const [countConv, setCountConv] = React.useState(null);
  const [countDiss, setCountDiss] = React.useState(null);
  const [countComm, setCountComm] = React.useState(null);
  const [amountConv, setAmountConv] = React.useState(null);
  const [amountDiss, setAmountDiss] = React.useState(null);
  const [amountComm, setAmountComm] = React.useState(null);
  const [amountDeadlines, setAmountDeadlines] = React.useState(null);
  const axios = useAxios();

  React.useEffect(() => {
    console.log("paymentsRecievedAmount ", paymentsRecievedAmount);
    axios.get(`/conventions_count_amount`).then(
      res => {
        console.log(res.data);
        setCountConv(res.data.count)
        setAmountConv(res.data.sum_amount);
      }, 
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
    ).then(
      axios.get(`/disbursements_count_amount`).then(
        res => {
          console.log(res.data);
          setCountDiss(res.data.count)
          setAmountDiss(res.data.sum_amount);
        }, 
        error => {
          console.log(error)
        }
      )
    ).then(
      axios.get(`/commitments_count_amount`).then(
        res => {
          console.log(res.data);
          setCountComm(res.data.count)
          setAmountComm(res.data.sum_amount);
        }, 
        error => {
          console.log(error)
        }
      )
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

  return (
    <Grid container>
    
        <Grid
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            alignItems: "stretch"
          }}
        >
          <Card
            sx={{
              p: 0,
              width: "100%",
              bgcolor:'#6ebb4b',
              boxShadow:3
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >

              <GiMoneyStack color="white" fontSize='40px' />

              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h3.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Budget global
              </Typography>
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
                  {pounds.format(amountConv)} 
              </Typography>
            </CardContent>
          </Card>

        </Grid>

        <Grid
          item
          xs={12}
          lg={3}
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

                  <GiPayMoney 
                        color="white"                     
                        fontSize='40px'
                      />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h3.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Budget décaissé
              </Typography>
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
                  {pounds.format(amountDiss)} 
              </Typography>
            </CardContent>
          </Card>

        </Grid>
{/* 
        <Grid
          item
          xs={12}
          lg={3}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
        

          <Card
            sx={{
              p: 0,
              width: "100%",
              bgcolor:'#c8d789'
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >

              <PeopleIcon 
                        fontSize='large'
                        style={{
                          color: "white",
                        }}                      
                      />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h2.fontSize",
                  fontWeight: "1000",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Emprunteurs
              </Typography>
              <Typography
                //color="primary"
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h1.fontSize",
                  fontWeight: "1000",
                  marginTop:1,
                  display:'flex', 
                  justifyContent: 'center',
                }}
              >
                 123
              </Typography>
            </CardContent>
          </Card>

        </Grid>
         */}
        <Grid
          item
          xs={12}
          lg={3}
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
              bgcolor:'#079ff0'
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >  

              <FaHandshake
                    fontSize='40px'
                    style={{
                      color: "white",
                    }}                      
              />
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h3.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Budget engagé
              </Typography>
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
                {pounds.format(amountComm)}
              </Typography>
            </CardContent>
          </Card>

        </Grid>

        <Grid
          item
          xs={12}
          lg={3}
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

              <GiReceiveMoney 
                fontSize='40px'
                color='white'                    
              />
              
              <Typography
                color={"#F6EEFA"}
                sx={{
                  fontSize: "h3.fontSize",
                  fontWeight: "600",
                  fontStyle:'initial',
                  display:'flex', 
                  justifyContent: 'center'
                }}
              >
                Dettes non payés
              </Typography>
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
            </CardContent>
          </Card>

        </Grid>
    </Grid>
  );
};

export default BlogCard;
