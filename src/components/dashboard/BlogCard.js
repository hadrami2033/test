import React, { useContext } from "react";
import { Card, CardContent, Typography, Button, Grid, Tooltip, Stack, Box } from "@mui/material";
import { FaHandshake } from 'react-icons/fa';
import { GiPayMoney, GiTakeMyMoney } from 'react-icons/gi';
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";

const BlogCard = (props) => {
  const {paymentsRecievedAmount} = props;
  //colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']
  //const { logoutUser } = useContext(AuthContext);

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
        //if(error.response && error.response.status === 401)
       // logoutUser()
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
          lg={4}
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
            <Box style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
              <GiTakeMyMoney color="white" fontSize='30px' />
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
                Montant global
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
                  {pounds.format(amountConv)} 
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
              bgcolor:'#1a7795',
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >

              <Box style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                <GiPayMoney 
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
                Montant décaissé
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
                  {pounds.format(amountDiss)} 
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
              bgcolor:'#079ff0'
            }}
          >
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
              }}
            >  

            <Box style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
              <FaHandshake
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
                Montant engagé
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
                  {pounds.format(amountComm)}
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

export default BlogCard;
