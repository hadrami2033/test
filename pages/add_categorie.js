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
/*import dayjs from 'dayjs';
 import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker"; */

/* const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');
const todayStartOfTheDay = today.startOf('day'); */


const CategorieForm = (props) => {
  const {conventionId, Categorie, push, update, showSuccessToast, showFailedToast, availableAmount} = props;

  const defaultValues = Categorie === null ? {
    type_id: null,
    amount: 0,
    convention: conventionId
  } : Categorie



  const CategorieStatus = [
    {
        id:null,
        label:"" 
    },
    {
        id:"Encour de traitement ",
        label:"Encour de traitement " 
    },
    {
        id:"Traité",
        label:"Traité" 
    },
    {
        id:"Envoyé",
        label:"Envoyé" 
    },
    {
        id:"Reçu",
        label:"Reçu" 
    }
  ]

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [categoriesType, setCategoriesType] = React.useState([]);

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("amount" in fieldValues)
      temp.amount = fieldValues.amount ? "" : "Le montant est requise";
    if ("type_id" in fieldValues)
      temp.type_id = fieldValues.type_id ? "" : "Le type requis";
   
      setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };



  React.useEffect(() => {
    console.log( "availableAmount ", availableAmount);
    apiService.getCategoriesType().then(
      res => {
        console.log(res.data);
        setCategoriesType(res.data);
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
      if(Categorie === null){
        apiService.addCategorie(values).then(
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
        apiService.updateCategorie(values).then(
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
    if(Categorie == null) 
      return "Ajouter un décaissement" 
    else
      return "Modifier un décaissement"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title={titleName()}>
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
              style={{width:'460px'}}
              name="type_id"
              label="Type"
              value={values.type_id}
              onChange={handleInputChange}
              options={categoriesType}
              error={errors.type_id}
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
export default CategorieForm;
