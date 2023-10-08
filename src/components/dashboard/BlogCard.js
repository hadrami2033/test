import React from "react";
import { Card, CardContent, Typography, Button, Grid, Tooltip, Stack, Box } from "@mui/material";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import CreditScoreSharpIcon from '@mui/icons-material/CreditScoreSharp';
import { FaHandshake } from 'react-icons/fa';
import { GiMoneyStack, GiPayMoney } from 'react-icons/gi';
import useAxios from "../../utils/useAxios";

const BlogCard = (props) => {
  const {clientsCount, numbersCount, selectFile, fileName, handleFile, verifyCompatibility} = props;
  //colors: ['#6ebb4b', '#1a7795',  '#a52e36' , '#079ff0', '#cc7c67' , '#c8d789']

  const [countConv, setCountConv] = React.useState(null);
  const [countDiss, setCountDiss] = React.useState(null);
  const [countComm, setCountComm] = React.useState(null);
  const [amountConv, setAmountConv] = React.useState(null);
  const [amountDiss, setAmountDiss] = React.useState(null);
  const [amountComm, setAmountComm] = React.useState(null);
  const axios = useAxios();

  React.useEffect(() => {
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
            alignItems: "stretch",
          }}
        >
          <Card
            sx={{
              p: 0,
              width: "100%",
              bgcolor:'#6ebb4b'
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
                Budget de conventions
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
              bgcolor:'#cc7c67'
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
    </Grid>
  );
};

export default BlogCard;
