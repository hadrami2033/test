import React, { useState } from "react";
import {
  Grid,
  Stack,
  Button,
  CircularProgress
} from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import { Form } from "../src/components/Form";
import Controls from "../src/components/controls/Controls";
import useAxios from "../src/utils/useAxios";


const DeadlineForm = (props) => {
  const {conventionId, deadline, push, update, showSuccessToast, showFailedToast, availableAmount, availableAmountRefCurrency} = props;
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
  const defaultValues = deadline === null ? {
    reference:"",
    order: null,
    amount: null,
    amount_ref_currency: null,
    date: formatDate(new Date()),
    convention: conventionId
  } : 
  {
    ...deadline
  }


  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  //const [status, setStatus] = React.useState([]);

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
    if ("order" in fieldValues)
      temp.order = fieldValues.order ? "" : "L'order est requis";
   
      setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const axios = useAxios();


  React.useEffect(() => {
    console.log( "availableAmount ", availableAmount);
    /* axios.get(`/statustype`).then(
      res => {
        console.log(res.data);
        setStatus(res.data)
      },
      error => console.log(error)
    ) */
  }, [])

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(deadline === null){
        axios.post(`/deadlines`, values).then(
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
        axios.put(`/deadlines/${values.id}`, values).then(
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

  const titleName = () => {
    if(deadline == null) 
      return "Ajouter une écheance" 
    else
      return "Modifier une écheance"
  }

  return (
        <BaseCard titleColor={"secondary"} title={titleName()}>
          {values &&
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

          <Stack style={styles.stack} spacing={2} direction="row">
              <Controls.Input
                style={{width:'50%'}}
                id="order-input"
                name="order"
                label="Order"
                type="number"
                value={values.order}
                onChange={handleInputChange}
                error={errors.order}
              />
              <Controls.DatePiccker
                style={{width:'50%'}}
                id="date"
                name="date"
                label="Date"
                value={formatDate(values.date)}
                onChange={handleInputChange}
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
export default DeadlineForm;
