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
import { useContext } from "react";
import AuthContext from "../context/AuthContext";



const InvoiceForm = (props) => {
  const {Invoice, push, update, showSuccessToast, showFailedToast, commitmentId, Commitments, convention} = props;
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
  const defaultValues = Invoice === null ? {
    reference: "",
    paymentmethod: null,
    paymentreference: null,
    date: formatDate(new Date()),
    comment: null,
    commitment: commitmentId ? commitmentId : null
  } : Invoice

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [commitments, setCommitments] = React.useState([]);
  const axios = useAxios();

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    if ("commitment" in fieldValues)
      temp.commitment = fieldValues.commitment ? "" : "Un engagement requis";
    if ("date" in fieldValues)
      temp.date = fieldValues.date ? "" : "Date requise";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { logoutUser } = useContext(AuthContext);



  React.useEffect(() => {
    if(convention){
      setCommitments(Commitments);
      console.log('convention selecteddddd ', Commitments);
    }else{
      axios.get(`/commitments`).then(
        res => {
          setCommitments(res.data);
        },  
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
        }
      ) 
    }
  }, [])

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(Invoice === null){
        axios.post(`/invoices`, values).then(
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
        axios.put(`/invoices/${values.id}`, values).then(
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
    if(Invoice == null) 
      return "Ajouter une facture" 
    else
      return "Modifier une facture"
  }

  return (
    
        <BaseCard titleColor={"secondary"} title= {titleName()}>
          {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}} >
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
            <Controls.DatePiccker
              style={{width:'50%'}}
              id="date"
              name="date"
              label="Date"
              value={formatDate(values.date)}
              onChange={handleInputChange}
              error={errors.date}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'50%'}}
              id="paymentmethod-input"
              name="paymentmethod"
              label="Mehhode de paiement"
              value={values.paymentmethod}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'50%'}}
              id="paymentreference-input"
              name="paymentreference"
              label="Reférence de paiement"
              value={values.paymentreference}
              onChange={handleInputChange}
            />
            
          </Stack>

          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={commitmentId ? {width:'100%'} : {width:'50%'}}
              id="comment-input"
              name="comment"
              label="Commentaire"
              value={values.comment}
              onChange={handleInputChange}
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
export default InvoiceForm;
