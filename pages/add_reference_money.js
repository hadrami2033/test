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
import states from '../src/helper/paymentstatustype'
import useAxios from "../src/utils/useAxios";

const ReferenceMoneyForm = (props) => {
  const {Money, push, update, showSuccessToast, showFailedToast, currencies} = props;

  const defaultValues = Money === null ? {
    label: null,
    code: null,
    description: null,

  } : Money

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("code" in fieldValues)
      temp.code = fieldValues.code ? "" : "Libelé requis";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
  const axios = useAxios();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      setLoading(true)
      let currencieSelcted = currencies.filter(e => e.id === values.code)
      let value = { code: currencieSelcted[0].code, label: currencieSelcted[0].label, description: currencieSelcted[0].description }
      if(Money === null){
        axios.post(`/reference_money`,value).then(
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
      } 
    } 
  };

  const titleName = () => {
    if(Money == null) 
      return "Ajouter une monnaie" 
    else
      return "Modifier une monnaie"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title= {titleName()}>
        {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Select
                style={{ width:'100%'} }
                name="code"
                label="Libelé"
                value={values.code}
                onChange={handleInputChange}
                options={currencies}
                error={errors.code}
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
export default ReferenceMoneyForm;
