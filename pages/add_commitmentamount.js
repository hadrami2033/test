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



const AmountForm = (props) => {
  const {push, update, showSuccessToast, showFailedToast, commitmentId} = props;

  const defaultValues = {
    currency_id: null,
    spendingtype_id: null,
    amount: null,
    commitment: commitmentId ? commitmentId : null
  }

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [commitments, setCommitments] = React.useState([]);
  const [currencies, setCurrencies] = React.useState([]);
  const [spendingtypes, setSpendingsType] = React.useState([]);


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("currency_id" in fieldValues)
      temp.currency_id = fieldValues.currency_id ? "" : "Devise est requis";
    if ("commitment" in fieldValues)
      temp.commitment = fieldValues.commitment ? "" : "Un engagement requis";
    if ("spendingtype_id" in fieldValues)
      temp.spendingtype_id = fieldValues.spendingtype_id ? "" : "Type de dépense requis";
    if ("amount" in fieldValues)
      temp.amount = fieldValues.amount ? "" : "Le montant requis";
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
    ) .then(() => {
        apiService.getCurrencies().then(
            res => {
              setCurrencies(res.data);
            },  
            error => console.log(error)
        ) 
    }).then(() => {
        apiService.getSpendingsTypes().then(
            res => {
              setSpendingsType(res.data);
            },  
            error => console.log(error)
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
        apiService.addCommitmentAmount(values).then(
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
      return "Ajouter un montant" 
  }

  return (
        <BaseCard titleColor={"secondary"} title= {titleName()}>
          {values &&
          <form onSubmit={handleSubmit}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'460px'}}
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
              style={{width:'460px'}}
              label="Devise"
              value={values.currency_id}
              onChange={handleInputChange}
              options={currencies}
              error={errors.currency_id}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Select
              name="spendingtype_id"
              style={commitmentId ? {width:'935px'} : {width:'460px'}}
              label="Type de dépense"
              value={values.spendingtype_id}
              onChange={handleInputChange}
              options={spendingtypes}
              error={errors.spendingtype_id}
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
export default AmountForm;
