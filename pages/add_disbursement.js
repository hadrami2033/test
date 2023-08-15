import React, { useState } from "react";
import {
  Grid,
  Stack,
  Button,
  CircularProgress
} from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import apiService from "../src/services/apiService";
import { Form } from "../src/components/Form";
import Controls from "../src/components/controls/Controls";
/*import dayjs from 'dayjs';
 import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker"; */

/* const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');
const todayStartOfTheDay = today.startOf('day'); */


const DibursementForm = (props) => {
  const {conventionId, dibursement, push, update, showSuccessToast, showFailedToast, availableAmount, currency} = props;

  const defaultValues = dibursement === null ? {
    reference: "",
    type: "",
    status: "",
    date: "",
    orderamount: 0,
    billamount: null,
    disbursementamount: null,
    convention: conventionId,
    currency: null,
    commitment: null
  } : dibursement

  const disbursementType = [
    {
        id:null,
        label:"" 
    },
    {
        id:"Paiement direct",
        label:"Paiement direct" 
    },
    {
        id:"DRF",
        label:"DRF" 
    },
    {
        id:"Avance",
        label:"Avance" 
    }
  ]

  const disbursementStatus = [
    {
        id:null,
        label:"" 
    },
    {
        id:"Encour de traitement ",
        label:"Encour de traitement " 
    },
    {
        id:"Traité",
        label:"Traité" 
    },
    {
        id:"Envoyé",
        label:"Envoyé" 
    },
    {
        id:"Reçu",
        label:"Reçu" 
    }
  ]

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [funders, setFunders] = React.useState([]);
  const [borrowers, setBorrowers] = React.useState([]);
  const [currencies, setCurrencies] = React.useState([]);
  const [commitments, setCommitments] = React.useState([]);

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    if ("type" in fieldValues)
      temp.type = fieldValues.type ? "" : "Le type requis";
    if ("status" in fieldValues)
      temp.status = fieldValues.status ? "" : "Le statut requis";
    if ("date" in fieldValues)
      temp.date = fieldValues.date ? "" : "Date requise";
    if ("orderamount" in fieldValues)
      temp.orderamount = ( fieldValues.orderamount && parseFloat(availableAmount) >= parseFloat(fieldValues.orderamount) ) ? "" : `Le montant requis et ne déppase pas ${pounds.format(availableAmount)} ${currency}`;
    if ("commitment" in fieldValues)
      temp.commitment = !( fieldValues.commitment == null && fieldValues.type === "Paiement direct" )   ? "" : "Un engagement requis pour un paiement direct";
    if ("billamount" in fieldValues)
      temp.billamount = !( fieldValues.billamount == null && fieldValues.status === "Reçu" ) ? "" : "Le montant requis d'un décaissement reçu";
    if ("currency" in fieldValues)
      temp.currency = !( fieldValues.currency == null && fieldValues.status === "Reçu" ) ? "" : "Dévise requis d'un décaissement reçu";
    if ("disbursementamount" in fieldValues)
      temp.disbursementamount = !( fieldValues.disbursementamount == null && fieldValues.status === "Reçu" ) ? "" : "Le montant dévise requis d'un décaissement reçu";
        
      setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };



  React.useEffect(() => {
    console.log( "availableAmount ", availableAmount);
    apiService.getFunders().then(
      res => {
        console.log(res.data);
        setFunders(res.data);
      },  
      error => console.log(error)
    ) 
    .then( () => {
            apiService.getBorrowers().then(
            res => {
              console.log(res.data);
              setBorrowers(res.data)
            },  
            error => console.log(error)
          )
    }
    )
    .then( () => {
          apiService.getCurrencies().then(
          res => {
            console.log(res.data);
            setCurrencies(res.data)
          },  
          error => console.log(error)
        )
    }
    )
    .then( () => {
        apiService.getCommitments().then(
        res => {
          console.log(res.data);
          setCommitments(res.data)
        },  
        error => console.log(error)
      )
  }
  )

  }, [])

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(dibursement === null){
        apiService.addDibursement(values).then(
          (res) => {
            console.log("added => " ,res);
            if(res.data){
              push(res.data)
              resetForm();
              showSuccessToast()
            }else{
              showFailedToast()
            }
          },
          (error) => {
            console.log(error);
            showFailedToast()
          } 
        ).then(() => {
          setLoading(false)
        });
      }else{
        apiService.updateDibursement(values).then(
          (res) => {
            console.log("updated => ", res);
            if(!res.data){
              showFailedToast()
            }else{
              update(values)
              showSuccessToast()
            }
          },
          (error) => {
            console.log(error);
            showFailedToast()
          } 
        ).then(() => {
          setLoading(false)
        });
      }
    }else{
        console.log(" invalid object ", values);
    }
    //console.log(formValues);
  };


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

  const titleName = () => {
    if(dibursement == null) 
      return "Ajouter un décaissement" 
    else
      return "Modifier un décaissement"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title={titleName()}>
          {values &&
          <form onSubmit={handleSubmit}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'300px'}}
              id="reference-input"
              name="reference"
              label="Reférence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />
            <Controls.Select
              style={{width:'300px'}}
              name="type"
              label="Type de décaissement"
              value={values.type}
              onChange={handleInputChange}
              options={disbursementType}
              error={errors.type}
            />
            <Controls.Select
              style={{width:'300px'}}
              name="status"
              label="Statut de décaissement"
              value={values.status}
              onChange={handleInputChange}
              options={disbursementStatus}
              error={errors.status}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style= {values.type === "Paiement direct" ? { width:'300px'} :  { width:'460px'}}
              id="orderamount-input"
              name="orderamount"
              label="Montant demandé"
              type="number"
              value={values.orderamount}
              onChange={handleInputChange}
              error={errors.orderamount}
            />
            {values.type === "Paiement direct" &&
            <Controls.Select
              style={{width:'300px'}}
              name="commitment"
              label="Engagement"
              value={values.commitment}
              onChange={handleInputChange}
              options={commitments}
              error={errors.commitment}
            />
            }
            <Controls.DatePiccker
              style={ values.type === "Paiement direct" ? { width:'300px'} :  { width:'460px'}}
              id="date"
              name="date"
              label="Date"
              value={formatDate(values.date)}
              onChange={handleInputChange}
              error={errors.date}
            />
          </Stack>
          {values.status === "Reçu" &&
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'300px'}}
              id="billamount-input"
              name="billamount"
              label="Montant locale"
              type = "number"
              value={values.billamount}
              onChange={handleInputChange}
              error={errors.billamount}
            />
            <Controls.Select
              style={{width:'300px'}}
              name="currency"
              label="Devise de décaissement"
              value={values.currency}
              onChange={handleInputChange}
              options={currencies}
              error={errors.currency}
            />
            <Controls.Input
              style={{width:'300px'}}
              id="disbursementamount-input"
              name="disbursementamount"
              type = "number"
              label="Montant en devise"
              value={values.disbursementamount}
              onChange={handleInputChange}
              error={errors.disbursementamount}
            />
          </Stack>
         }

{/*           <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'935px'}}
              id="description-input"
              name="description"
              label="Description"
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            
          <Controls.DatePiccker
              id="start_date"
              name="start_date"
              label="Date début"
              value={formatDate(values.start_date)}
              onChange={handleInputChange}
              error={errors.start_date}
            />
            <Controls.DatePiccker
              id="end_date"
              name="end_date"
              label="Date fin"
              value={formatDate(values.end_date)}
              onChange={handleInputChange}
              error={errors.end_date}
            />
            <Controls.DatePiccker
              id="start_date_refund-input"
              name="start_date_refund"
              label="Date début de remboursement"
              value={formatDate(values.start_date_refund)}
              onChange={handleInputChange}
              error={errors.start_date_refund}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.DatePiccker
              id="end_date_refund-input"
              name="end_date_refund"
              label="Date fin de remboursement"
              value={formatDate(values.end_date_refund)}
              onChange={handleInputChange}
              error={errors.end_date_refund}
            />
            <Controls.DatePiccker
              id="end_date_grace_period-input"
              name="end_date_grace_period"
              label="Date fin de grace periode"
              value={formatDate(values.end_date_grace_period)}
              onChange={handleInputChange}
              error={errors.end_date_grace_period}
            />
            <Controls.Input
              style={{width:'300px'}}
              id="interest_rate-input"
              name="interest_rate"
              label="Taux d'intéret"
              type="number"
              value={values.interest_rate}
              onChange={handleInputChange}
              error={errors.interest_rate}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Select
              style={{width:'300px'}}
              name="funder_id"
              label="Bailleur"
              value={values.funder}
              onChange={handleInputChange}
              options={funders}
              error={errors.funder}
            />
            <Controls.Select
              style={{width:'300px'}}
              name="borrower_id"
              label="Emprunteur"
              value={values.borrower}
              onChange={handleInputChange}
              options={borrowers}
              error={errors.borrower}
            />
            <Controls.Select
              style={{width:'300px'}}
              name="currency_id"
              label="Devise"
              value={values.currency}
              onChange={handleInputChange}
              options={currencies}
              error={errors.currency}
            />
          </Stack> */}



{/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} />
      </DemoContainer>
    </LocalizationProvider> */}


          <br />
          <Button
            type="submit"
            style={{ fontSize: "25px" }}
            variant="contained"
            disabled={loading}
            mt={4}
          >
             Sauvegarder
            {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: 'primary',
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
          </Button>
          
          </form>
        }
        </BaseCard>
      
  );
};

const styles = {
  stack: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 10,
  },
};
export default DibursementForm;
