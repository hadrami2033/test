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


const DeadlineForm = (props) => {
  const {conventionId, deadline, push, update, showSuccessToast, showFailedToast, availableAmount} = props;

  const defaultValues = deadline === null ? {
    label:"",
    order: 0,
    amount: 0,
    convention: conventionId
  } : 
  {
    ...deadline
  }


  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("label" in fieldValues)
      temp.label = fieldValues.label ? "" : "Label est requis";
    if ("amount" in fieldValues)
      temp.amount = fieldValues.amount ? "" : "Le montant est requis";
    if ("order" in fieldValues)
      temp.order = fieldValues.order ? "" : "L'order est requis";
   
      setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };



  React.useEffect(() => {
    console.log( "availableAmount ", availableAmount);
  }, [])

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(deadline === null){
        apiService.addDeadline(values).then(
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
        apiService.updateDeadline(values).then(
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
          <form onSubmit={handleSubmit}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'300px'}}
              id="label-input"
              name="label"
              label="Libelé"
              value={values.label}
              onChange={handleInputChange}
              error={errors.label}
            />
            <Controls.Input
              style={{width:'300px'}}
              id="amount-input"
              name="amount"
              label="Montant"
              type="number"
              value={values.amount}
              onChange={handleInputChange}
              error={errors.amount}
            />
            <Controls.Input
              style={{width:'300px'}}
              id="order-input"
              name="order"
              label="Order"
              type="number"
              value={values.order}
              onChange={handleInputChange}
              error={errors.order}
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
export default DeadlineForm;
