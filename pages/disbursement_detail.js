
import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, CircularProgress  } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";


const DetailDisbursement = (props) => {
  const {disbursement, disbursementStatus, disbursementtypes, currency} = props;

  const [loading, setLoading] = React.useState(false);

 

  useEffect(() => {
    console.log(disbursement);
    console.log(disbursementStatus);
    console.log(disbursementtypes);
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
      let e = disbursementStatus.filter(e => e.code === code );
      return e[0].label
    }
    return null;
  }

  const getCurrenteState = () => {
    let currente_state = disbursement.status.length > 0 ? 
    getStatusByCode(Math.max(...disbursement.status.map(s => s.type.code)))
    : getStatusByCode(1);
    return currente_state;
  }



  const getDisbursementStatusByCode = (code) =>{
    if(code){
      let e = disbursement.status.filter(e => e.type.code === code );
      let res = e[0] ? e[0].type.label : null
      return res
    }
    return null;
  }

  const getDisbursementStatusDateByCode = (code) =>{
    if(code){
      let e = disbursement.status.filter(e => e.type.code === code );
      let res = e[0].date ? e[0].date : null
      return res
    }
    return null;
  }


  const getTypeByCode = (code) =>{
    if(code){
      let e = disbursementtypes.filter(e => e.code === code );
      return e[0].label
    }
    return null;
  }


  const getType = (id) => {
    if(id){
        let e = disbursementtypes.filter(e => e.id === id );
        return e[0].label
    }
    return null
  }


  return (
    <BaseCard titleColor={"secondary"} title={ disbursement ? disbursement.reference : ""}>
            {/* <Box display="flex" alignItems="center" justifyContent="center">
                <Typography color="secondary" fontSize="25px" fontWeight={'1000'} variant="h2" >{disbursement ? disbursement.reference : ""}</Typography>
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
            {disbursement && disbursementStatus.length > 0 && disbursementtypes.length > 0 &&
                <Grid container spacing={2} marginLeft={'15px'}>

                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                                Type : {disbursement.type.label}
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
                                Date : {formatDate(disbursement.date)}
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
                                Montant demandé : {pounds.format(disbursement.orderamount)}  {disbursement.currency.label} 
                            </Typography>
                        </Grid>
                        {getType(disbursement.type.id) === getTypeByCode(1) &&
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Catégorie : {disbursement.categorie.reference}
                            </Typography>
                        </Grid>
                        }{getType(disbursement.type.id) === getTypeByCode(1) &&
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Engagement : {disbursement.commitment.reference}
                            </Typography>
                        </Grid>
                        }{getType(disbursement.type.id) === getTypeByCode(1) &&
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Facture : {disbursement.invoice.reference}
                            </Typography>
                        </Grid>
                        }

                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Etat : {getCurrenteState()}
                            </Typography>
                        </Grid>
                        {getDisbursementStatusByCode(2) &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Date d'envoi : {getDisbursementStatusDateByCode(2) ?
                             formatDate(getDisbursementStatusDateByCode(2)) : null }
                            </Typography>
                        </Grid>
                        }{getDisbursementStatusByCode(3) &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Date de recéption : {getDisbursementStatusDateByCode(3) ?
                             formatDate(getDisbursementStatusDateByCode(3)) : null }
                            </Typography>
                        </Grid>
                        }

                        {getDisbursementStatusByCode(4) &&
                        <Grid item xs={6}>
                            <Typography
                                color="#837B7B" 
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Date du cloture : {getDisbursementStatusDateByCode(4) ?
                             formatDate(getDisbursementStatusDateByCode(4)) : null }
                            </Typography>
                        </Grid>
                        }{disbursement.disbursementamount &&
                        <Grid item xs={6}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontSize: "h4.fontSize",
                                fontStyle:'initial'
                                }}
                            >
                            Montant décaissé : {pounds.format(disbursement.disbursementamount)} {currency}
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

export default DetailDisbursement;
