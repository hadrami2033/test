import React, { useState } from "react";
import {
  Grid,
  Stack,
  Button,
  CircularProgress
} from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import { Form } from "./Form";
import Controls from "./controls/Controls";
import useAxios from "../utils/useAxios";
import dayjs from 'dayjs';
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useRouter } from "next/router";
/*import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';*/

//import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker"; 
//import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
//import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
//import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

/* const today = dayjs();
const yesterday = dayjs().subtract(1, 'day');
const todayStartOfTheDay = today.startOf('day'); */


const ConventionForm = (props) => {
  const {convention, showSuccessToast, showFailedToast} = props;

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

  const [valueDateRange, setValueDateRange] = useState([
    dayjs(new Date()),
    dayjs(new Date()),
  ]);

  const [valueRefundDateRange, setValueRefundDateRange] = useState([
    dayjs(new Date()),
    dayjs(new Date()),
  ]);

  const defaultValues = convention === null ? {
    reference: "",
    object: "",
    retrocede: false,
    amount: null,
    amount_ref_currency: null,
    start_date: formatDate(valueDateRange[0]),
    end_date: formatDate(valueDateRange[1]),
    start_date_refund: formatDate(new Date()),
    end_date_refund: formatDate(new Date()),
    end_date_grace_period: formatDate(new Date()),
    interest_rate: "",
    costs: null,
    description: "",
    object: "",
    funder_id: null,
    borrower_id: null,
    currency_id: null,
    convention_periode: null,
    grace_periode: null
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


  const compareDates = (d1, d2) => {
    console.log(formatDate(d1), formatDate(d2));
    console.log(d1>d2);
    return d1>d2;
  }



  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [funders, setFunders] = React.useState([]);
  const [borrowers, setBorrowers] = React.useState([]);
  const [currencies, setCurrencies] = React.useState([]);
  const axios = useAxios();
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    /* if ("retrocede" in fieldValues)
      temp.retrocede = fieldValues.retrocede !== null ? "" : "Rétrocéde requise"; */
    if ("amount" in fieldValues)
      temp.amount = fieldValues.amount ? "" : "Le montant de la convention est requis";
    if ("amount_ref_currency" in fieldValues)
      temp.amount_ref_currency = fieldValues.amount_ref_currency ? "" : "Le montant en monnaie de référence est requis";
    if ("costs" in fieldValues)
      temp.costs = (fieldValues.retrocede === false || ( fieldValues.costs && fieldValues.costs.length <= 2 )) ? "" : "La commission est requise d'une convention rétrocédée et doit être deux chiffres en max";
    if ("start_date" in fieldValues)
      temp.start_date = fieldValues.start_date ? "" : "Date début requise";
    if ("end_date" in fieldValues)
      temp.end_date = fieldValues.end_date ? "" : "Date fin requise";
    if ("start_date_refund" in fieldValues)
      temp.start_date_refund = fieldValues.start_date_refund ? "" : "Date début de rembourssement requise";
    if ("end_date_refund" in fieldValues)
      temp.end_date_refund = fieldValues.end_date_refund ? "" : "Date fin de rembourssement requise";
   /*  if ("end_date_grace_period" in fieldValues)
      temp.end_date_grace_period = fieldValues.end_date_grace_period && 
      compareDates(new Date(fieldValues.end_date_grace_period) , new Date(values.start_date)) ? "" : "Date fin de la grace période doit etre supérieur a la date début";
     */
    if ("interest_rate" in fieldValues)
      temp.interest_rate = ( fieldValues.interest_rate && fieldValues.interest_rate.length <= 2 ) ? "" : "Taux d'intéret est requis et doit être deux chiffres en max";
    if ("object" in fieldValues)
      temp.object = fieldValues.object ? "" : "L'objet est requis";
    if ("funder_id" in fieldValues)
      temp.funder_id = fieldValues.funder_id ? "" : "Un bailleur est requis";   
    if ("borrower_id" in fieldValues)
      temp.borrower_id = fieldValues.borrower_id ? "" : "L'emprunteur est requis";   
    if ("currency_id" in fieldValues)
      temp.currency_id = fieldValues.currency_id ? "" : "La dévise est requise";
    if ("convention_periode" in fieldValues)
      temp.convention_periode = fieldValues.convention_periode ? "" : "La periode de la convenion est requise";   
    if ("grace_periode" in fieldValues)
      temp.grace_periode = fieldValues.grace_periode ? "" : "La période de grace est requise";     
    if ("currency_id" in fieldValues)
      temp.currency_id = fieldValues.currency_id ? "" : "La dévise est requise";  
    
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { logoutUser } = useContext(AuthContext);
  const router = useRouter()


  React.useEffect(() => {
    axios.get(`/funders`).then(
      res => {
        console.log(res.data);
        setFunders(res.data);
      },  
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
    ) 
    .then( () => {
      axios.get(`/borrowers`).then(
            res => {
              console.log(res.data);
              setBorrowers(res.data)
            },  
            error => console.log(error)
          )
    }
    )
    .then( () => {
        axios.get(`/currencies`).then(
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
        axios.post(`/conventions`, values).then(
          (res) => {
            console.log("added => " ,res);
            if(res.data){
              resetForm();
              showSuccessToast()
              router.push({
                pathname: '/convention_detail',
                query: { id: res.data.id }
              })
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
        axios.put(`/conventions/${values.id}`, values).then(
          (res) => {
            console.log("updated => ", res);
            if(!res.data){
              resetForm();
              showFailedToast()
            }else{
              showSuccessToast()
              router.push({
                pathname: '/convention_detail',
                query: { id: convention.id }
              })
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
    if(convention == null) 
      return "Ajouter une convention" 
    else
      return "Modifier une convention"
  }

  const changeRangeDate = (val) =>{
    console.log(val);
    values["start_date"] = formatDate(val[0])
    values["end_date"] = formatDate(val[1])
    setValueDateRange(val)
  }

  const changeRefundRangeDate = (val) =>{
    console.log(val);
    values["start_date_refund"] = formatDate(val[0])
    values["end_date_refund"] = formatDate(val[1])
    setValueRefundDateRange(val)
  }

  const getBorrower = (id) => {
    let b = id ? borrowers.find((e) => e.id === id) : null ;
    if(b)
     return b.label
    else
      return null
  }

  return (
    
        <BaseCard titleColor={"secondary"} title={titleName()}>
          {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'50%'}}
              id="reference-input"
              name="reference"
              label="Reférence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />
            <Controls.Input
              style={{width:'50%'}}
              id="object-input"
              name="object"
              label="Objet"
              value={values.object}
              onChange={handleInputChange}
              error={errors.object}
            />

          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Select
              style={getBorrower(values.borrower_id) != "SOGEM" ? {width:'42%'} : {width:'50%'}}
              name="funder_id"
              label="Bailleur"
              value={values.funder_id}
              onChange={handleInputChange}
              options={funders}
              error={errors.funder_id}
            />  
            <Controls.Select
              style={getBorrower(values.borrower_id) != "SOGEM" ? {width:'42%'} : {width:'50%'}}
              name="borrower_id"
              label="Emprunteur"
              value={values.borrower_id}
              onChange={handleInputChange}
              options={borrowers}
              error={errors.borrower_id}
            />

          {getBorrower(values.borrower_id) != "SOGEM" &&
              <Controls.Checkbox
                name="retrocede"
                label="Retrocedée"
                value={values.retrocede}
                onChange={handleInputChange}
                options={retrocedes}
              />
          }
          </Stack>



          <Stack style={styles.stack} spacing={2} direction="row">
              {values.retrocede === true &&
                <Controls.Input
                  style={{width:'33.33%'}}
                  id="costs-input"
                  name="costs"
                  label="Taux de la commission en %"
                  type="number"
                  value={values.costs}
                  onChange={handleInputChange}
                  error={errors.costs}
              />
              }
            <Controls.Input
              style= {values.retrocede === true ? { width:'33.33%'} : { width:'50%'}}
              id="amount_ref_currency-input"
              name="amount_ref_currency"
              label="Montant en monnaie de référence "
              type="number"
              value={values.amount_ref_currency}
              onChange={handleInputChange}
              error={errors.amount_ref_currency}
            />
            <Controls.Input
              style= {values.retrocede === true ? { width:'33.33%'} : { width:'50%'}}
              id="interest_rate-input"
              name="interest_rate"
              label="Taux d'intérêt en %"
              type="number"
              value={values.interest_rate}
              onChange={handleInputChange}
              error={errors.interest_rate}
            />
          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style= {{ width:'50%'}}
              id="amount-input"
              name="amount"
              label="Montant de la convention"
              type="number"
              value={values.amount}
              onChange={handleInputChange}
              error={errors.amount}
            />
            <Controls.Select
              style={{width:'50%'}}
              name="currency_id"
              label="Devise"
              value={values.currency_id}
              onChange={handleInputChange}
              options={currencies}
              error={errors.currency_id}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.DatePiccker
              style={{width:'50%'}}
              id="start_date"
              name="start_date"
              label="Date début"
              value={formatDate(values.start_date)}
              onChange={handleInputChange}
              error={errors.start_date}
            />
            <Controls.DatePiccker
              style={{width:'50%'}}
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
              style={{width:'50%'}}
              id="start_date_refund-input"
              name="start_date_refund"
              label="Date début de remboursement"
              value={formatDate(values.start_date_refund)}
              onChange={handleInputChange}
              error={errors.start_date_refund}
            />
            <Controls.DatePiccker
              style={{width:'50%'}}
              id="end_date_refund-input"
              name="end_date_refund"
              label="Date fin de remboursement"
              value={formatDate(values.end_date_refund)}
              onChange={handleInputChange}
              error={errors.end_date_refund}
            />
          </Stack>


            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateRangePicker']}>
                <DateRangePicker localeText={{ start: 'Date debut', end: 'Date fin' }} 
                    value={valueDateRange}
                    onChange={(newValue) => changeRangeDate(newValue) }
                />
              </DemoContainer>
            </LocalizationProvider> */}


           {/*  <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateRangePicker']}>
                <DateRangePicker localeText={{ start: 'Date début de remboursement', end: 'Date fin de remboursement' }} 
                    value={valueRefundDateRange}
                    onChange={(newValue) => changeRefundRangeDate(newValue) }
                />
              </DemoContainer>
            </LocalizationProvider> */}


          <Stack style={{...styles.stack, marginTop:8 }} spacing={2} direction="row">
            <Controls.Input
              style={{width:'50%'}}
              id="periode-input"
              name="convention_periode"
              type='number'
              label="Période de la convention (en mois)"
              value={values.convention_periode}
              onChange={handleInputChange}
              error={errors.convention_periode}
            />
            <Controls.Input
              style={{width:'50%'}}
              id="grace_periode-input"
              name="grace_periode"
              type='number'
              label="Période de grace (en mois)"
              value={values.grace_periode}
              onChange={handleInputChange}
              error={errors.grace_periode}
            />
          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.TextArea
              style={{width:'100%'}}
              id="description-input"
              name="description"
              label="Description"
              multiline="multiline"
              rows={4}
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
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
export default ConventionForm;
