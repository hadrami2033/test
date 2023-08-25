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



const InvoiceForm = (props) => {
  const {Invoice, push, update, showSuccessToast, showFailedToast} = props;

  const defaultValues = Invoice === null ? {
    reference: "",
    paymentmethod: "",
    paymentreference: "",
    date: "",
    comment: ""
  } : Invoice

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [contractors, setContractors] = React.useState([]);


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    if ("paymentmethod" in fieldValues)
      temp.paymentmethod = fieldValues.paymentmethod ? "" : "La méthode de paiement requise";
    if ("paymentreference" in fieldValues)
      temp.paymentreference = fieldValues.paymentreference ? "" : "La reférence de paiement requise";
    if ("date" in fieldValues)
      temp.date = fieldValues.date ? "" : "Date requise";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };



/*   React.useEffect(() => {
    apiService.getContractors().then(
      res => {
        console.log(res.data);
        setContractors(res.data);
      },  
      error => console.log(error)
    ) 
  }, []) */

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(Invoice === null){
        apiService.addInvoice(values).then(
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
        apiService.updateInvoice(values).then(
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
    if(Invoice == null) 
      return "Ajouter une facture" 
    else
      return "Modifier une facture"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title= {titleName()}>
          {values &&
          <form onSubmit={handleSubmit}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              id="reference-input"
              name="reference"
              label="Reférence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />
            <Controls.Input
              id="paymentmethod-input"
              name="paymentmethod"
              label="Mehhode de paiement"
              value={values.paymentmethod}
              onChange={handleInputChange}
              error={errors.paymentmethod}
            />
            <Controls.Input
              id="paymentreference-input"
              name="paymentreference"
              label="Reférence de paiement"
              value={values.paymentreference}
              onChange={handleInputChange}
              error={errors.paymentreference}
            />
            
          </Stack>

          <Stack style={styles.stack} spacing={9.5} direction="row">
            
            <Controls.DatePiccker
              id="date"
              name="date"
              label="Date"
              value={formatDate(values.date)}
              onChange={handleInputChange}
              error={errors.date}
            />
            <Controls.Input
              id="comment-input"
              name="comment"
              label="Commentaire"
              value={values.comment}
              onChange={handleInputChange}
            />
          </Stack>
 

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
export default InvoiceForm;
