import React, { useContext, useState } from "react";
import {
  Stack,
  Button,
  CircularProgress,
  Box
} from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import { Form } from "../src/components/Form";
import Controls from "../src/components/controls/Controls";
import useAxios from "../src/utils/useAxios";
import AuthContext from "../src/context/AuthContext";


const PaymentForm = (props) => {
  const {deadlineId, push, showSuccessToast, showFailedToast, availableAmount, availableAmountRefCurrency, payment,
    availabeState, currenteState} = props;
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
  const defaultValues = payment === null ? {
    reference:"",
    comment: null,
    amount: null,
    amount_ref_currency: null,
    interests: null,
    commission: null,
    date: formatDate(new Date()),
    deadline: deadlineId
  } : 
  {
    ...payment,
    new_state_date: formatDate(new Date()),
    status_id: currenteState ? currenteState.id : getStatusId(1)
  }


  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  //const [status, setStatus] = React.useState([]);
  const [paymentStatus, setPaymentStatus] = React.useState([]);

  let pounds = Intl.NumberFormat({
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "Référence est requis";
    if ("amount" in fieldValues)
      temp.amount = (fieldValues.amount && (parseFloat(fieldValues.amount) <= parseFloat(availableAmount))) ? "" : 
      `Le montant est requis, et ne déppase pas ${pounds.format(availableAmount)}`;
    
      if ("amount_ref_currency" in fieldValues)
      temp.amount_ref_currency = (fieldValues.amount_ref_currency && (parseFloat(fieldValues.amount_ref_currency) <= parseFloat(availableAmountRefCurrency))) ? "" : 
      `Le Montant en monnaie de référence est requis, et ne déppase pas ${pounds.format(availableAmountRefCurrency)}`;
   
    if ("comment" in fieldValues)
      temp.comment = fieldValues.comment ? "" : "L'order est requis";
   
      setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { logoutUser } = useContext(AuthContext);
  const axios = useAxios();


  React.useEffect(() => {
    console.log( "availableAmount ", availableAmount)

    axios.get(`/paymentstatustype`).then(
        res => {
          console.log(res.data);
          setPaymentStatus(res.data)
        },
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
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
      if(payment === null){
        axios.post(`/deadlinepayments`, values).then(
          (res) => {
            console.log("added => " ,res);
            if(res.data){
              push(res.data)
              resetForm();
              const state = 
              {
                type_id: getStatusId(1),
                payment: res.data.id,
                date: formatDate(new Date()),
              }
              axios.post(`/paymentstatus`, state).then(
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
        axios.put(`/deadlinepayments/${values.id}`, values).then(
          (res) => {
            console.log("updated => ", res);
            if(!res.data){
              showFailedToast()
            }else{
              push(values)
              const state = 
              {
                type_id: values.status_id,
                payment: payment.id,
                date: values.new_state_date
              }
              console.log(" state ", state);
              if( getStatusCode(values.status_id) > currenteState.code ){
                axios.post(`/paymentstatus`, state).then(
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

  const titleName = () => {
    if(payment == null) 
      return "Ajouter un paiement" 
    else
      return "Modifier un paiement"
  }
  
  const getStatusId = (code) =>{
    if(code && paymentStatus.length > 0){
      let e = paymentStatus.filter(e => e.code === code );
      return e[0].id
    }
    return null;
  }

  const getStatusCode = (id) =>{
    if(id){
      let e = paymentStatus.filter(e => e.id === id );
      return e[0].code
    }
    return null;
  }

  return (
        <BaseCard titleColor={"secondary"} title={titleName()}>
          { ( values && paymentStatus.length > 0 ) ?
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'33.33%'}}
              id="label-input"
              name="reference"
              label="Référence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />
            <Controls.Input
              style={{width:'33.33%'}}
              id="amount-input"
              name="amount"
              label="Montant"
              type="number"
              value={values.amount}
              onChange={handleInputChange}
              error={errors.amount}
            />

            <Controls.Input
              style={{width:'33.33%'}}
              id="amount_ref_currency-input"
              name="amount_ref_currency"
              label="Montant en monnaie de référence"
              type="number"
              value={values.amount_ref_currency}
              onChange={handleInputChange}
              error={errors.amount_ref_currency}
            />

          </Stack>
         {payment &&
          <Stack style={styles.stack} spacing={2} direction="row">
              <Controls.Select
                style={{width:'50%'}}
                name="status_id"
                label="Statut de paiement"
                value={values.status_id}
                onChange={handleInputChange}
                options={availabeState}
                //error={errors.status_id}
              />
              <Controls.DatePiccker
                style={{ width:'50%'}}
                id="new_state_date"
                name="new_state_date"
                label="Date de nouvel état"
                value={formatDate(values.new_state_date)}
                onChange={handleInputChange}
                error={errors.new_state_date}
              />
          </Stack>
        }
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'50%'}}
              id="interests-input"
              name="interests"
              label="Intérêts"
              type="number"
              value={values.interests}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'50%'}}
              id="commission-input"
              name="commission"
              label="Commission"
              type="number"
              value={values.commission}
              onChange={handleInputChange}
            />
          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
              <Controls.DatePiccker
                style={{width:'50%'}}
                id="date"
                name="date"
                label="Date"
                value={formatDate(values.date)}
                onChange={handleInputChange}
              />
              <Controls.Input
                style={{width:'50%'}}
                id="order-input"
                name="comment"
                label="Commentaire"
                value={values.comment}
                onChange={handleInputChange}
                error={errors.comment}
              />
          </Stack>


          <br />
          <Stack style={styles.stack} spacing={2}>
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
          </Stack>

          </form>
          :
          <div style={{width: "100%", marginTop: '20px', display: 'flex', justifyContent: "center"}}>
            <Box style={{fontSize: '16px'}}>
              Pas de données de configuration !
            </Box>
          </div>
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
export default PaymentForm;
