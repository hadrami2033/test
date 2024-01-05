
import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, CircularProgress  } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";


const DetailPayment = (props) => {
  const {payment, paymentStatus, currency} = props;

  const [loading, setLoading] = React.useState(false);

 

  useEffect(() => {
    console.log(payment);
    console.log(paymentStatus);
    console.log(currency);
  }, [])

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

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  

  const getStatusByCode = (code) =>{
    if(code){
      let e = paymentStatus.filter(e => e.code === code );
      return e[0].label
    }
    return null;
  }

  const getCurrenteState = () => {
    let currente_state = payment.status.length > 0 ? 
    getStatusByCode(Math.max(...payment.status.map(s => s.type.code)))
    : getStatusByCode(1);
    return currente_state;
  }



  const getPaymentStatusByCode = (code) =>{
    if(code){
      let e = payment.status.filter(e => e.type.code === code );
      let res = e[0] ? e[0].type.label : null
      return res
    }
    return null;
  }

  const getPaymentStatusDateByCode = (code) =>{
    if(code){
      let e = payment.status.filter(e => e.type.code === code );
      let res = e[0].date ? e[0].date : null
      return res
    }
    return null;
  }

  return (
    <BaseCard titleColor={"secondary"} title={ payment ? "Paiement : " + payment.reference : ""}>
            {/* <Box display="flex" alignItems="center" justifyContent="center">
                <Typography color="secondary" fontSize="25px" fontWeight={'1000'} variant="h2" >{payment ? payment.reference : ""}</Typography>
            </Box> */}
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
            {payment && paymentStatus.length > 0 &&
                <Grid container spacing={2} marginLeft={'15px'}>

                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                                Reférence : {payment.reference}
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
                                Date : {formatDate(payment.date)}
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
                                Montant : {pounds.format(payment.amount)}  {currency} 
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
                                Montant en monnaie de référence : {pounds.format(payment.amount_ref_currency)} 
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
                                Intérêts : {payment.interests ? pounds.format(payment.interests) : 0}  {currency} 
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
                                Commission : {payment.commission ? pounds.format(payment.commission) : 0}  {currency} 
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
                                Commentaire : {payment.comment}
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
                            État : {getCurrenteState()}
                            </Typography>
                        </Grid>
                        {getPaymentStatusByCode(1) &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                                Établis le : {getPaymentStatusDateByCode(1) ?
                             formatDate(getPaymentStatusDateByCode(1)) : null }
                            </Typography>
                        </Grid>
                        }{getPaymentStatusByCode(2) &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                             Exécuter par la banque le : {getPaymentStatusDateByCode(2) ?
                             formatDate(getPaymentStatusDateByCode(2)) : null }
                            </Typography>
                        </Grid>
                        }

                        {getPaymentStatusByCode(3) &&
                        <Grid item xs={6}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                             Reçu par le bailleur le : {getPaymentStatusDateByCode(3) ?
                             formatDate(getPaymentStatusDateByCode(3)) : null }
                            </Typography>
                        </Grid>
                        }                     
                    </Grid>
                }
          </Box>
        }
    </BaseCard>

  );
};

export default DetailPayment;
