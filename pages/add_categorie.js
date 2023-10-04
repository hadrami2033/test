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


const CategorieForm = (props) => {
  const {conventionId, Categorie, push, update, showSuccessToast, showFailedToast, availableAmount} = props;

  const defaultValues = !Categorie ? {
    reference:"",
    type_id: null,
    amount: null,
    convention: conventionId
  } : 
  {
    ...Categorie,
    type_id:Categorie.type.id
  }

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [categoriesType, setCategoriesType] = React.useState([]);
  const axios = useAxios();

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La reférence est requise";
    if ("amount" in fieldValues)
      temp.amount = fieldValues.amount ? "" : "Le montant est requis";
    if ("type_id" in fieldValues)
      temp.type_id = fieldValues.type_id ? "" : "Le type requis";
   
      setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { logoutUser } = useContext(AuthContext);


  React.useEffect(() => {
    console.log( "availableAmount ", availableAmount);
    axios.get(`/categoriestype`).then(
      res => {
        console.log(res.data);
        setCategoriesType(res.data);
      },  
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
    ) 
  }, [])

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(Categorie === null){
        axios.post(`/categories`, values).then(
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
        axios.put(`/categories/${values.id}`,values).then(
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
    if(Categorie == null) 
      return "Ajouter une catégorie" 
    else
      return "Modifier une catégorie"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title={titleName()}>
          {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'33.33%'}}
              id="reference-input"
              name="reference"
              label="Reférence"
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
            <Controls.Select
              style={{width:'33.33%'}}
              name="type_id"
              label="Type"
              value={values.type_id}
              onChange={handleInputChange}
              options={categoriesType}
              error={errors.type_id}
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
export default CategorieForm;
