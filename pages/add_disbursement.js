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
//import disbursementtypes from "../src/helper/disbursementtype"
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
  const { conventionId, disbursement, push, update, showSuccessToast, showFailedToast, 
          availableAmount, currency, currenteState, availabeState, categories,
          Invoices, Commitments} = props;

  const defaultValues = disbursement === null ? {
    reference: "",
    type_id: null,
    status_id: null,
    date: "",
    orderamount: null,
    disbursementamount: null,
    convention: conventionId,
    currency_id: null,
    commitment_id: null,
    categorie_id: null,
    invoice_id: null
  } : { ...disbursement, 
        currency_id : disbursement.currency.id, 
        type_id : disbursement.type.id,
        status_id: currenteState ? currenteState.id : getStatusByCode(1).id,
        categorie_id: disbursement.categorie && disbursement.categorie.id,
        commitment_id: disbursement.commitment && disbursement.commitment.id,
        invoice_id: disbursement.invoice && disbursement.invoice.id
      }

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [funders, setFunders] = React.useState([]);
  const [borrowers, setBorrowers] = React.useState([]);
  const [currencies, setCurrencies] = React.useState([]);
  const [commitments, setCommitments] = React.useState([]);
  const [invoices, setInvoices] = React.useState([]);
  const [disbursementTypes, setDisbursementTypes] = React.useState([]);
  const [disbursementStatus, setDisbursementStatus] = React.useState([]);

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    if ("type_id" in fieldValues)
      temp.type_id = fieldValues.type_id ? "" : "Le type requis";
    /* if ("status_id" in fieldValues)
      temp.status_id = fieldValues.status_id ? "" : "Le statut requis"; */
    if ("date" in fieldValues)
      temp.date = fieldValues.date ? "" : "Date requise";
    if ("orderamount" in fieldValues)
      temp.orderamount = ( fieldValues.orderamount && parseFloat(availableAmount) >= parseFloat(fieldValues.orderamount) ) ? "" : `Le montant requis et ne déppase pas ${pounds.format(availableAmount)} ${currency}`;
    if ("commitment_id" in fieldValues)
      temp.commitment_id = !(fieldValues.commitment_id == null && getType(fieldValues.type_id) === getTypeByCode(1))   ? "" : "Un engagement requis pour un paiement direct";
    if ("categorie_id" in fieldValues)
      temp.categorie_id = !(fieldValues.categorie_id == null && getType(fieldValues.type_id) === getTypeByCode(1))   ? "" : "Une catégorie requise pour un paiement direct";
    if ("invoice_id" in fieldValues)
      temp.invoice_id = !(fieldValues.invoice_id == null && getType(fieldValues.type_id) === getTypeByCode(1))   ? "" : "Une facture requise pour un paiement direct";
   if ("currency_id" in fieldValues)
      temp.currency_id = !(fieldValues.currency_id == null) ? "" : "Dévise de décaissement requis";
    if ("disbursementamount" in fieldValues)
      temp.disbursementamount = !( fieldValues.disbursementamount == null && getStatus(fieldValues.status_id) === getStatusByCode(3) && disbursement ) ? "" : "Le montant dévise requis d'un décaissement reçu";
        
      setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };



  React.useEffect(() => {
    console.log( "availableAmount ", availableAmount);
    if(Commitments.length > 0)
    setCommitments(Commitments)
    if(Invoices.length > 0)
    setInvoices(Invoices)
    apiService.getDisbursementsTypes().then(
      res => {
        console.log(res.data);
        setDisbursementTypes(res.data);
      },  
      error => console.log(error)
    ) 
    .then( () => {
            apiService.getStatusType().then(
            res => {
              console.log(res.data);
              setDisbursementStatus(res.data)
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
  /*   .then( () => {
        apiService.getDisbursementsTypes().then(
        res => {
          console.log(res.data);
          setDisbursementTypes(res.data)
        },  
        error => console.log(error)
      )
    }
    )
    .then( () => {
      apiService.getCommitment().then(
      res => {
        console.log(res.data);
        setCommitments(res.data)
      },  
      error => console.log(error)
    )
  }
  ) */

  }, [])

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(disbursement === null){
        apiService.addDisbursement(values).then(
          (res) => {
            console.log("added => " ,res);
            if(res.data){
              push(res.data)
              resetForm();
              const state = 
              {
                type_id: getStatusId(1),
                disbursement: res.data.id,
                date: formatDate(new Date()),
                comment: null
              }
              apiService.addStatus(state).then(
                (res) =>{
                  console.log("res  ", res);
                },
                (err) =>{
                  console.log(err);
                }
              )
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
        apiService.updateDisbursement(values).then(
          (res) => {
            console.log("updated => ", res);
            if(!res.data){
              showFailedToast()
            }else{
              update(values)
              const state = 
              {
                type_id: values.status_id,
                disbursement: disbursement.id,
                date: formatDate(new Date()),
                comment: "test 2"
              }
              console.log(" state ", state);
              if( getStatusCode(values.status_id) > currenteState.code ){

                apiService.addStatus(state).then(
                  (res) =>{
                    console.log("res  ", res);
                  },
                  (err) =>{
                    console.log(err);
                  }
                )
              }
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
    if(disbursement == null) 
      return "Ajouter un décaissement" 
    else
      return "Modifier un décaissement"
  }

  const getType = (id) => {
    if(id){
    let e = disbursementTypes.filter(e => e.id === id );
    return e[0].label
    }
    return null
  }

  const getStatus = (id) => {
    if(id && disbursementStatus.length > 0){
      let e = disbursementStatus.filter(e => e.id === id );
      return e[0].label
    }
    return null;
  }
  
  const getStatusId = (code) =>{
    if(code && disbursementStatus.length > 0){
      let e = disbursementStatus.filter(e => e.code === code );
      return e[0].id
    }
    return null;
  }

  const getStatusByCode = (code) =>{
    if(code){
      let e = disbursementStatus.filter(e => e.code === code );
      return e[0].label
    }
    return null;
  }

  const getStatusCode = (id) =>{
    if(id){
      let e = disbursementStatus.filter(e => e.id === id );
      return e[0].code
    }
    return null;
  }

  const getTypeByCode = (code) =>{
    if(code){
      let e = disbursementTypes.filter(e => e.code === code );
      return e[0].label
    }
    return null;
  }


  const categorieChange = e =>{
    let v = e.target.value;
    let selected = categories.filter(e => e.id === v );
    console.log(selected[0]);
    selected[0].commitments && setCommitments(selected[0].commitments)
    handleInputChange(e)
  }

  const commitmentChange = e =>{
    let v = e.target.value;
    let selected = commitments.filter(e => e.id === v );
    console.log(selected[0]);
    selected[0].invoices && setInvoices(selected[0].invoices)
    handleInputChange(e)
  }

  return (
    
        <BaseCard titleColor={"secondary"} title={titleName()}>
        {values && disbursementStatus.length > 0 && disbursementTypes.length > 0 &&
          <form onSubmit={handleSubmit}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{ width:'460px'}}
              id="reference-input"
              name="reference"
              label="Reférence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />
            {!disbursement ?
              <Controls.Select
                style={{ width:'460px'} }
                name="type_id"
                label="Type de décaissement"
                value={values.type_id}
                onChange={handleInputChange}
                options={disbursementTypes}
                error={errors.type_id}
              />
            :
              <Controls.Select
                style={{width:'460px'}}
                name="status_id"
                label="Statut de décaissement"
                value={values.status_id}
                onChange={handleInputChange}
                options={availabeState}
                //error={errors.status_id}
              />
            }
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style= {
                (!disbursement || (getStatus(values.status_id) === getStatusByCode(3) && disbursement))
                ? { width:'300px'} :  { width:'460px'}
              }
              id="orderamount-input"
              name="orderamount"
              label="Montant demandé"
              type="number"
              value={values.orderamount}
              onChange={handleInputChange}
              error={errors.orderamount}
            />
            <Controls.Select
              style={
                (!disbursement || (getStatus(values.status_id) === getStatusByCode(3) && disbursement))
                ? { width:'300px'} :  { width:'460px'}
              }
              name="currency_id"
              label="Devise de décaissement"
              value={values.currency_id}
              onChange={handleInputChange}
              options={currencies}
              error={errors.currency_id}
            />

            {!disbursement &&            
            <Controls.DatePiccker
              style={{ width:'300px'}}
              id="date"
              name="date"
              label="Date"
              value={formatDate(values.date)}
              onChange={handleInputChange}
              error={errors.date}
            />
            }
            {getStatus(values.status_id) === getStatusByCode(3) && disbursement &&
            <Controls.Input
              style={{ width:'300px'}}
              id="disbursementamount-input"
              name="disbursementamount"
              type = "number"
              label="Montant décaissé"
              value={values.disbursementamount}
              onChange={handleInputChange}
              error={errors.disbursementamount}
            />
            }


          </Stack>
          {getType(values.type_id) === getTypeByCode(1) &&
            <Stack style={styles.stack} spacing={2} direction="row">

                <Controls.Select
                  style={{width:'300px'}}
                  name="categorie_id"
                  label="Catégorie"
                  value={values.categorie_id}
                  onChange={categorieChange}
                  options={categories}
                  error={errors.categorie_id}
                />
                <Controls.Select
                  style={{width:'300px'}}
                  name="commitment_id"
                  label="Engagement"
                  value={values.commitment_id}
                  onChange={commitmentChange}
                  options={commitments}
                  error={errors.commitment_id}
                />
                <Controls.Select
                  style={{width:'300px'}}
                  name="invoice_id"
                  label="Facture"
                  value={values.invoice_id}
                  onChange={handleInputChange}
                  options={invoices}
                  error={errors.invoice_id}
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
