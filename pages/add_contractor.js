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

const ContractorForm = (props) => {
  const {Contractor, push, update, showSuccessToast, showFailedToast} = props;

  const defaultValues = Contractor === null ? {
    code: null,
    label: null,
    address: null,
    telephone: null,
    iban: null
  } : Contractor

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);


  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("code" in fieldValues)
      temp.code = fieldValues.code ? "" : "Le code est requis";
    if ("label" in fieldValues)
      temp.label = fieldValues.label ? "" : "Libelé requis";
    if ("address" in fieldValues)
      temp.address = fieldValues.address ? "" : "Addrésse est réquis";
    if ("telephone" in fieldValues)
      temp.telephone = fieldValues.telephone ? "" : "Télephone est réquis";
    if ("iban" in fieldValues)
      temp.iban = fieldValues.iban ? "" : "Iban est réquis";
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
      if(Contractor === null){
        axios.post(`/contractors`, values).then(
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
        axios.put(`/contractors/${values.id}`, values).then(
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
    if(Contractor == null) 
      return "Ajouter un prestateur" 
    else
      return "Modifier un prestateur"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title= {titleName()}>
        {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'50%'}}
              id="code-input"
              name="code"
              label="Code"
              value={values.code}
              onChange={handleInputChange}
              error={errors.code}
            />
            <Controls.Input
              style={{width:'50%'}}
              id="label"
              name="label"
              label="Libelé"
              value={values.label}
              onChange={handleInputChange}
              error={errors.label}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'50%'}}
              id="telephone-input"
              name="telephone"
              type='number'
              label="Teléphone"
              value={values.telephone}
              onChange={handleInputChange}
              error={errors.telephone}
            />
            <Controls.Input
              style={{width:'50%'}}
              id="iban-input"
              name="iban"
              label="Iban"
              value={values.iban}
              onChange={handleInputChange}
              error={errors.iban}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'100%'}}
              id="address-input"
              name="address"
              label="Addrésse"
              value={values.address}
              onChange={handleInputChange}
              error={errors.address}
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
export default ContractorForm;
