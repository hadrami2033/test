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


const ConventionForm = (props) => {
  const {convention, showSuccessToast, showFailedToast} = props;

  const defaultValues = convention === null ? {
    reference: "",
    object: "",
    retrocede: null,
    amount: null,
    start_date: "",
    end_date: "",
    start_date_refund: "",
    end_date_refund: "",
    end_date_grace_period: "",
    interest_rate: "",
    costs: null,
    description: "",
    object: "",
    funder_id: null,
    borrower_id: null,
    currency_id: null
  } : { 
        ...convention, 
        funder_id: convention.funder.id, 
        borrower_id: convention.borrower.id,
        currency_id: convention.currency.id
      }

  const retrocedes = [
    {
        id:true,
        label:"Oui" 
    },
    {
        id:false,
        label:"Non" 
    }
  ]
  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [funders, setFunders] = React.useState([]);
  const [borrowers, setBorrowers] = React.useState([]);
  const [currencies, setCurrencies] = React.useState([]);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    if ("retrocede" in fieldValues)
      temp.retrocede = fieldValues.retrocede !== null ? "" : "Rétrocéde requise";
    if ("amount" in fieldValues)
      temp.amount = fieldValues.amount ? "" : "Le montant requis";
    if ("costs" in fieldValues)
      temp.costs = !(fieldValues.retrocede === true && ( fieldValues.costs === null || fieldValues.costs === '' || fieldValues.costs === '0' )) ? "" : "La commission est requise d'une convention retrocedée";
    if ("start_date" in fieldValues)
      temp.start_date = fieldValues.start_date ? "" : "Date début requise";
    if ("end_date" in fieldValues)
      temp.end_date = fieldValues.end_date ? "" : "Date fin requise";
    if ("start_date_refund" in fieldValues)
      temp.start_date_refund = fieldValues.start_date_refund ? "" : "Date début de rembourssement requise";
    if ("end_date_refund" in fieldValues)
      temp.end_date_refund = fieldValues.end_date_refund ? "" : "Date fin de rembourssement requise";
    if ("end_date_grace_period" in fieldValues)
      temp.end_date_grace_period = fieldValues.end_date_grace_period ? "" : "Date fin grace période requise";
    if ("interest_rate" in fieldValues)
      temp.interest_rate = fieldValues.interest_rate ? "" : "Taux d'intéret est requis";
    if ("object" in fieldValues)
      temp.object = fieldValues.object ? "" : "L'objet est requis";
    if ("funder_id" in fieldValues)
      temp.funder_id = fieldValues.funder_id ? "" : "Un bailleur est requis";   
    if ("borrower_id" in fieldValues)
      temp.borrower_id = fieldValues.borrower_id ? "" : "L'emprunteur est requis";   
    if ("currency_id" in fieldValues)
      temp.currency_id = fieldValues.currency_id ? "" : "La dévise est requise";   
    
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };



  React.useEffect(() => {
    apiService.getFunders().then(
      res => {
        console.log(res.data);
        setFunders(res.data);
      },  
      error => console.log(error)
    ) 
    .then( () => {
            apiService.getBorrowers().then(
            res => {
              console.log(res.data);
              setBorrowers(res.data)
            },  
            error => console.log(error)
          )
    }
    )
    .then( () => {
          apiService.getCurrencies().then(
          res => {
            console.log(res.data);
            setCurrencies(res.data)
          },  
          error => console.log(error)
        )
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
      if(convention === null){
        apiService.addConvention(values).then(
          (res) => {
            console.log("added => " ,res);
            if(res.data){
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
        apiService.updateConvention(values).then(
          (res) => {
            console.log("updated => ", res);
            if(!res.data){
              resetForm();
              showFailedToast()
            }else{
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
    if(convention == null) 
      return "Ajouter une convention" 
    else
      return "Modifier une convention"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title={titleName()}>
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
            <Controls.Select
              style={{width:'460px'}}
              name="retrocede"
              label="Retrocedé ?"
              value={values.retrocede}
              onChange={handleInputChange}
              options={retrocedes}
              error={errors.retrocede}
            />

          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style= { values.retrocede === true ? { width:'460px'} :  { width:'935px'}}
              id="amount-input"
              name="amount"
              label="Montant"
              type="number"
              value={values.amount}
              onChange={handleInputChange}
              error={errors.amount}
            />
            {values.retrocede === true &&
              <Controls.Input
              style={{width:'460px'}}
              id="costs-input"
              name="costs"
              label="Commission"
              type="number"
              value={values.costs}
              onChange={handleInputChange}
              error={errors.costs}
            />
            }
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Select
              style={{width:'460px'}}
              name="currency_id"
              label="Devise"
              value={values.currency_id}
              onChange={handleInputChange}
              options={currencies}
              error={errors.currency_id}
            />
            <Controls.Input
              style={{width:'460px'}}
              id="interest_rate-input"
              name="interest_rate"
              label="Taux d'intéret"
              type="number"
              value={values.interest_rate}
              onChange={handleInputChange}
              error={errors.interest_rate}
            />
          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Select
              style={{width:'460px'}}
              name="funder_id"
              label="Bailleur"
              value={values.funder_id}
              onChange={handleInputChange}
              options={funders}
              error={errors.funder_id}
            />
            <Controls.Select
              style={{width:'460px'}}
              name="borrower_id"
              label="Emprunteur"
              value={values.borrower_id}
              onChange={handleInputChange}
              options={borrowers}
              error={errors.borrower_id}
            />
          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.DatePiccker
              style={{width:'460px'}}
              id="start_date"
              name="start_date"
              label="Date début"
              value={formatDate(values.start_date)}
              onChange={handleInputChange}
              error={errors.start_date}
            />
            <Controls.DatePiccker
              style={{width:'460px'}}
              id="end_date"
              name="end_date"
              label="Date fin"
              value={formatDate(values.end_date)}
              onChange={handleInputChange}
              error={errors.end_date}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.DatePiccker
              style={{width:'460px'}}
              id="start_date_refund-input"
              name="start_date_refund"
              label="Date début de remboursement"
              value={formatDate(values.start_date_refund)}
              onChange={handleInputChange}
              error={errors.start_date_refund}
            />
            <Controls.DatePiccker
              style={{width:'460px'}}
              id="end_date_refund-input"
              name="end_date_refund"
              label="Date fin de remboursement"
              value={formatDate(values.end_date_refund)}
              onChange={handleInputChange}
              error={errors.end_date_refund}
            />
          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.DatePiccker
              style={{width:'935px'}}
              id="end_date_grace_period-input"
              name="end_date_grace_period"
              label="Date de la fin de la periode de grace"
              value={formatDate(values.end_date_grace_period)}
              onChange={handleInputChange}
              error={errors.end_date_grace_period}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'935px'}}
              id="object-input"
              name="object"
              label="Objet"
              value={values.object}
              onChange={handleInputChange}
              error={errors.object}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'935px'}}
              id="description-input"
              name="description"
              label="Description"
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
            />
          </Stack>





{/* <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateRangePicker']}>
        <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} />
      </DemoContainer>
    </LocalizationProvider> */}


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
export default ConventionForm;
