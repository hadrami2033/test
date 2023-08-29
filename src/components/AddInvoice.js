import React, { useState } from "react";
import {
  Grid,
  Stack,
  Button,
  CircularProgress
} from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import apiService from "../services/apiService";
import { Form } from "./Form";
import Controls from "./controls/Controls";



const InvoiceForm = (props) => {
  const {Invoice, push, update, showSuccessToast, showFailedToast, commitmentId} = props;

  const defaultValues = Invoice === null ? {
    reference: "",
    paymentmethod: null,
    paymentreference: null,
    date: "",
    comment: null,
    commitment: commitmentId ? commitmentId : null
  } : Invoice

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [commitments, setCommitments] = React.useState([]);


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    if ("commitment" in fieldValues)
      temp.commitment = fieldValues.commitment ? "" : "Un engagement requis";
    if ("date" in fieldValues)
      temp.date = fieldValues.date ? "" : "Date requise";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };



  React.useEffect(() => {
    apiService.getCommitments().then(
      res => {
        setCommitments(res.data);
      },  
      error => console.log(error)
    ) 
  }, [])

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
              if(push)
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
              if(update)
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
              style={{width:'460px'}}
              id="reference-input"
              name="reference"
              label="Reférence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />
            <Controls.DatePiccker
              style={{width:'460px'}}
              id="date"
              name="date"
              label="Date"
              value={formatDate(values.date)}
              onChange={handleInputChange}
              error={errors.date}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'460px'}}
              id="paymentmethod-input"
              name="paymentmethod"
              label="Mehhode de paiement"
              value={values.paymentmethod}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'460px'}}
              id="paymentreference-input"
              name="paymentreference"
              label="Reférence de paiement"
              value={values.paymentreference}
              onChange={handleInputChange}
            />
            
          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={commitmentId ? {width:'935px'} : {width:'460px'}}
              id="comment-input"
              name="comment"
              label="Commentaire"
              value={values.comment}
              onChange={handleInputChange}
            />
            {!commitmentId &&
              <Controls.Select
                name="commitment"
                style={{width:'460px'}}
                label="Engagement"
                value={values.commitment}
                onChange={handleInputChange}
                options={commitments}
                error={errors.commitment}
              />
            }
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
