import React, { useState } from "react";
import {
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



const CommitmentForm = (props) => {
  const {Commitment, showSuccessToast, showFailedToast, convention} = props;

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

  const defaultValues = Commitment === null ? {
    reference: "",
    status: "active",
    start_date: formatDate(new Date()),
    end_date: formatDate(new Date()),
    close_date: formatDate(new Date()),
    description: "",
    contractor_id: null,
    categorie: null
  } : {...Commitment, contractor_id:Commitment.contractor.id}

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [contractors, setContractors] = React.useState([]);
  const [conventions, setConventions] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const axios = useAxios();
  const commitmentSatus = [
    {
        id:"active",
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
/*     if ("status" in fieldValues)
      temp.status = fieldValues.status ? "" : "Statut requise"; */
    if ("start_date" in fieldValues)
      temp.start_date = fieldValues.start_date ? "" : "Date début requise";
    if ("end_date" in fieldValues)
      temp.end_date = fieldValues.end_date ? "" : "Date fin requise";
    if ("close_date" in fieldValues)
      temp.close_date = fieldValues.close_date ? "" : "Date clôture requise";
    if ("categorie" in fieldValues)
      temp.categorie = fieldValues.categorie ? "" : "Une catégorie est requise";   
    if ("contractor_id" in fieldValues)
      temp.contractor_id = fieldValues.contractor_id ? "" : "Un prestataire est requis";  
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { logoutUser } = useContext(AuthContext);


  React.useEffect(() => {
    if(convention){
      setCategories(convention.categories)
    }
    axios.get(`/contractors`).then(
      res => {
        console.log(res.data);
        setContractors(res.data);
      },  
      error => {
        console.log(error)
        if(error.response && error.response.status === 401)
        logoutUser()
      }
    ). then(() => {
      axios.get(`/conventions`).then(
        res => {
          console.log(res.data);
          setConventions(res.data);
        },  
        error => console.log(error)
      )
    })
  }, [])

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);
    

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values);
    if (validate()) {
      setLoading(true)
      console.log(values);
      if(Commitment === null){
        axios.post(`/commitments`, values).then(
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
        axios.put(`/commitments/${values.id}`, values).then(
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

  const titleName = () => {
    if(Commitment == null) 
      return "Ajouter un engagement" 
    else
      return "Modifier un engagement"
  }


  const conventionChange = e =>{
    let v = e.target.value;
    let selected = conventions.filter(e => e.id === v );
    console.log(selected[0]);
    (selected[0] && selected[0].categories) && setCategories(selected[0].categories)
    //handleInputChange(e)
  }

  return (
    
        <BaseCard titleColor={"secondary"} title= {titleName()}>
          {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              id="reference-input"
              style={{width:'50%'}}
              name="reference"
              label="Reférence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />

            <Controls.Select
              name="contractor_id"
              style={{width:'50%'}}
              label="Prestateur"
              value={values.contractor_id}
              onChange={handleInputChange}
              options={contractors}
              error={errors.contractor_id}
            />
            
          </Stack>
          {!Commitment &&
          <Stack style={styles.stack} spacing={2} direction="row">
            {!convention &&
            <Controls.Select
              style={{width:'50%'}}
              label="Convention"
              onChange={conventionChange}
              options={conventions}
            />
            }
            <Controls.Select
              name="categorie"
              style={convention ? {width:'100%'} : {width:'50%'}}
              label="Catégorie"
              value={values.categorie}
              onChange={handleInputChange}
              options={categories}
              error={errors.categorie}
            />
          </Stack>
          }
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
              style={{width:'100%'}}
              id="close_date-input"
              name="close_date"
              label="Date clôture"
              value={formatDate(values.close_date)}
              onChange={handleInputChange}
              error={errors.close_date}
            />
          </Stack>
        
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.TextArea
              style={Commitment ? {width:'50%'} : {width:'100%'}}
              id="description-input"
              name="description"
              label="Description"
              value={values.description}
              onChange={handleInputChange}
              error={errors.description}
            />
            {Commitment &&
            <Controls.Select
              style={{width:'50%'}}
              name="status"
              label="Statut"
              value={values.status}
              onChange={handleInputChange}
              options={commitmentSatus}
              error={errors.status}
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
                  marginLeft: '-12px'
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
export default CommitmentForm;
