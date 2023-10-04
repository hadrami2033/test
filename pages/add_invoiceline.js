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
import { useContext } from "react";
import AuthContext from "../src/context/AuthContext";



const InvoiceLineForm = (props) => {
  const {push, update, showSuccessToast, showFailedToast, invoiceId} = props;

  const defaultValues = {
    currency_id: null,
    amount: null,
    invoice: invoiceId ? invoiceId : null
  }

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [invoices, setInvoices] = React.useState([]);
  const [currencies, setCurrencies] = React.useState([]);
  const axios = useAxios();

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("currency_id" in fieldValues)
      temp.currency_id = fieldValues.currency_id ? "" : "Devise est requis";
    if ("invoice" in fieldValues)
      temp.invoice = fieldValues.invoice ? "" : "Une facture requise";
    if ("amount" in fieldValues)
      temp.amount = fieldValues.amount ? "" : "Le montant requis";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };
  const { logoutUser } = useContext(AuthContext);

  React.useEffect(() => {
    axios.get(`/invoices`).then(
      res => {
        setInvoices(res.data);
      },  
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
    ) .then(() => {
      axios.get(`/currencies`).then(
            res => {
              setCurrencies(res.data);
            },  
            error => {
              console.log(error)
              if(error.response && error.response.status === 401)
              logoutUser()
            }
        ) 
    })
  }, [])

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      axios.post(`/invoicelines`, values).then(
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
    } 
    //console.log(formValues);
  };

  const titleName = () => {
      return "Ajouter une ligne de facture" 
  }

  return (
        <BaseCard titleColor={"secondary"} title= {titleName()}>
          {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={invoiceId ? {width:'50%'} : {width:'33.33%'}}
              id="amount-input"
              name="amount"
              label="Montant"
              type="number"
              value={values.amount}
              onChange={handleInputChange}
              error={errors.amount}
            />
            <Controls.Select
              name="currency_id"
              style={invoiceId ? {width:'50%'} : {width:'33.33%'}}
              label="Devise"
              value={values.currency_id}
              onChange={handleInputChange}
              options={currencies}
              error={errors.currency_id}
            />
            {!invoiceId &&
             <Controls.Select
               name="invoice"
               style={{width:'33.33%'}}
               label="Facture"
               value={values.invoice}
               onChange={handleInputChange}
               options={invoices}
               error={errors.invoice}
             />
            }
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
             SAUVEGARDER
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
export default InvoiceLineForm;
