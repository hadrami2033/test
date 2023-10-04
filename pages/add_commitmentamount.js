import React, { useState } from "react";
import {
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



const AmountForm = (props) => {
  const {push, update, showSuccessToast, showFailedToast, commitmentId} = props;

  const defaultValues = {
    currency_id: null,
    amount: null,
    amount_by_ref_currency: null,
    commitment: commitmentId ? commitmentId : null
  }

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [commitments, setCommitments] = React.useState([]);
  const [currencies, setCurrencies] = React.useState([]);
  const axios = useAxios();


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
    if ("amount_by_ref_currency" in fieldValues)
      temp.amount_by_ref_currency = fieldValues.amount_by_ref_currency ? "" : "Le montant en monnaie de référence est requis";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };


  const { logoutUser } = useContext(AuthContext);

  React.useEffect(() => {
    axios.get(`/commitments`).then(
      res => {
        setCommitments(res.data);
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
      axios.post(`/commitmentamounts`, values).then(
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
              style={{width:'85%'}}
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
              style={{width:'15%'}}
              label="Devise"
              value={values.currency_id}
              onChange={handleInputChange}
              options={currencies}
              error={errors.currency_id}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={commitmentId ? {width:'100%'} : {width:'50%'}}
              id="amount_by_ref_currency-input"
              name="amount_by_ref_currency"
              label="Montant en monnaie de référence "
              type="number"
              value={values.amount_by_ref_currency}
              onChange={handleInputChange}
              error={errors.amount_by_ref_currency}
            />
            {!commitmentId &&
             <Controls.Select
               name="commitment"
               style={{width:'50%'}}
               label="Engagement"
               value={values.commitment}
               onChange={handleInputChange}
               options={commitments}
               error={errors.commitment}
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
export default AmountForm;
