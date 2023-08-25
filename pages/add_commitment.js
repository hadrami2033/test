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



const CommitmentForm = (props) => {
  const {Commitment, push, update, showSuccessToast, showFailedToast} = props;

  const defaultValues = Commitment === null ? {
    reference: "",
    status: "",
    start_date: "",
    end_date: "",
    close_date: "",
    description: "",
    contractor: null
  } : Commitment

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [contractors, setContractors] = React.useState([]);

  const commitmentSatus = [
    {
        id:"Active",
        label:"Active" 
    },
    {
        id:"Cloturé",
        label:"Cloturé" 
    },
    {
        id:"Suspendu",
        label:"Suspendu" 
    }
  ]

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    if ("status" in fieldValues)
      temp.status = fieldValues.status ? "" : "Statut requise";
    if ("start_date" in fieldValues)
      temp.start_date = fieldValues.start_date ? "" : "Date début requise";
    if ("end_date" in fieldValues)
      temp.end_date = fieldValues.end_date ? "" : "Date fin requise";
    if ("close_date" in fieldValues)
      temp.close_date = fieldValues.close_date ? "" : "Date clôture requise";
    if ("contractor" in fieldValues)
      temp.contractor = fieldValues.contractor ? "" : "Un prestataire est requis";   
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };



  React.useEffect(() => {
    apiService.getContractors().then(
      res => {
        console.log(res.data);
        setContractors(res.data);
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
      if(Commitment === null){
        apiService.addCommitment(values).then(
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
        apiService.updateCommitment(values).then(
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
    if(Commitment == null) 
      return "Ajouter un engagement" 
    else
      return "Modifier un engagement"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title= {titleName()}>
          {values &&
          <form onSubmit={handleSubmit}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              id="reference-input"
              name="reference"
              label="Reférence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />
            <Controls.Select
              name="status"
              label="Statut"
              value={values.status}
              onChange={handleInputChange}
              options={commitmentSatus}
              error={errors.status}
            />
            <Controls.Select
              name="contractor"
              label="Prestateur"
              value={values.contractor}
              onChange={handleInputChange}
              options={contractors}
              error={errors.contractor}
            />
            
          </Stack>

          <Stack style={styles.stack} spacing={9.5} direction="row">
            
          <Controls.DatePiccker
              id="start_date"
              name="start_date"
              label="Date début"
              value={formatDate(values.start_date)}
              onChange={handleInputChange}
              error={errors.start_date}
            />
            <Controls.DatePiccker
              id="end_date"
              name="end_date"
              label="Date fin"
              value={formatDate(values.end_date)}
              onChange={handleInputChange}
              error={errors.end_date}
            />
            <Controls.DatePiccker
              id="close_date-input"
              name="close_date"
              label="Date clôture"
              value={formatDate(values.close_date)}
              onChange={handleInputChange}
              error={errors.close_date}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              id="description-input"
              name="description"
              label="Description"
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
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
export default CommitmentForm;
