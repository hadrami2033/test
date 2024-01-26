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

const SpendingTypeForm = (props) => {
  const {SpendingType, push, update, showSuccessToast, showFailedToast} = props;

  const defaultValues = SpendingType === null ? {
    label: null,
    description: null
  } : SpendingType

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("label" in fieldValues)
      temp.label = fieldValues.label ? "" : "Libelé requis";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
  const axios = useAxios();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(SpendingType === null){
        axios.post(`/spendingtypes`,values).then(
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
        axios.put(`/spendingtypes/${values.id}`,values).then(
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

  const titleName = () => {
    if(SpendingType == null) 
      return "Ajouter un type de dépense" 
    else
      return "Modifier un type de dépense"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title= {titleName()}>
        {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'50%'}}
              id="label"
              name="label"
              label="Libelé"
              value={values.label}
              onChange={handleInputChange}
              error={errors.label}
            />
            <Controls.Input
              style={{width:'50%'}}
              id="description-input"
              name="description"
              label="Description"
              value={values.description}
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
export default SpendingTypeForm;
