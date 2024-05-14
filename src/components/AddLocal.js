import React, { useState } from "react";
import {
  Stack,
  Button,
  CircularProgress
} from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import { Form } from "./Form";
import Controls from "./controls/Controls";


const LocalForm = (props) => {
  const {local, showSuccessToast, showFailedToast, propriete} = props;

  const defaultValues = (local == null) ? {
    propriete: propriete,
    date_creation: new Date().toISOString(),
    date_modification: "",
    local_photo: "",
    local_photo_path: "",
    local_photo_text: "",
    reference: "",
    posetage: "",
    typeunite: "",
    occupee: "",
    occupe_par_proprietaire: "",
    occupation_type: "",
    locationtype: "",
    montant: "",
    source: "",
    activite_principale: "",
    chiffre_affaire: "",
    categorie: "",
    description: "",
    montant_du_loyer: "",
    adresse: "",
    contribuable: "",
    type: ""    
  } : local;

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [booleans, setBools] = React.useState([
    { id:"Oui", label:"Oui" },
    { id:"Non"   , label:"Non"    },
    { id:"Indeterminé"      , label:"Indeterminé"       }
  ]);

  const [constructions, setConstructions] = React.useState([
    { id:"Villa"					,label:"Villa"						},
    { id:"Appartement"				,label:"Appartement"				},
    { id:"Immeuble"				,label:"Immeuble"					},
    { id:"Centre commercial(Marsa)",label:"Centre commercial(Marsa)"	},
    { id:"Mixte"					,label:"Mixte"						},
    { id:"Magasin/Boutique"		,label:"Magasin/Boutique"			},
    { id:"Hangar"					,label:"Hangar"						},
    { id:"Autre"					,label:"Autre"						}
  ]);
  const [locationtypes, setLocationtypes] = React.useState([
    {id:"Ordinaire" ,label:"Ordinaire"},
    {id:"Convention" ,label:"Convention"},
    {id:"Soumise au précompte"  ,label:"Soumise au précompte" },
    {id:"Waghf" ,label:"Waghf"}
  ]);

  const [sources, setSources] = React.useState([
    {id:"Locataire" , label:"Locataire"},
    {id:"Contrat"  , label:"Contrat" },
    {id:"Propriétaire"  , label:"Propriétaire"  },
    {id:"Autre" , label:"Autre" }
  ]);

  const [categories, setCategories] = React.useState([
    {id:"Grande" , label:"Grande"},
    {id:"Moyenne"  , label:"Moyenne"},
    {id:"Petite"  , label:"Petite"}
  ]);

  const [occupations, setOccupations] = React.useState([
    { id:"Habitation", label:"Habitation" },
    { id:"Activité Commerçiale"   , label:"Activité Commerçiale" }
  ]);
  const validate = (fieldValues = values) => {
    let temp = { ...errors };
   /*  if ("reference" in fieldValues)
      temp.reference = fieldValues.reference ? "" : "La référence est requise";
    if ("amount" in fieldValues)
      temp.amount = fieldValues.amount ? "" : "Le montant de la convention est requis";
    if ("amount_ref_currency" in fieldValues)
      temp.amount_ref_currency = fieldValues.amount_ref_currency ? "" : "Le montant en monnaie de référence est requis";
    if ("costs" in fieldValues)
      temp.costs = (fieldValues.retrocede === false || ( fieldValues.costs && fieldValues.costs.length <= 2 )) ? "" : "La commission est requise d'une convention rétrocédée et doit être deux chiffres en max";
 */
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } = Form(formValues, true, validate);

  const handleSubmit = (event) => {
    event.preventDefault();
    var loc = { ...values, 
      //local_photo_path2 : values.local_photo_path, 
      //local_photo_path : 'local_' + values.wilaya.replace(" ", "_") + "_" + values.moughataa.replace(" ", "_") + "_" + values.commune.replace(" ", "_") + "_" + values.ilot.replace(" ", "_").replace(" ", "_") + "_" + values.lot.toString() + "_" + values.lot_Suitt.replace(" ", "_") + ".jpeg", 
      date_modification : new Date().toISOString()
    }
    //console.log("prop    :   "  ,prop);
    setLoading(true)
    if(local === null){
        fetch(`${origin}/api/local`, {
          method: 'POST',
          body: JSON.stringify(loc),
        })
          .then((response) => {
            if (response.status === 401) {
              showFailedToast()
              throw new Error('Could not edit local. Database is read-only');
            }
    
            if (response.status !== 201) {
              response.json().then((data) => {
                showFailedToast()
                throw new Error(`Error Creating local: ${data.message}`);
              });
            }
            return response;
          })
          .then((response) => response.json())
          .then((data) => {
            showSuccessToast()
            console.log("dta added : ", data);
          })
          .catch((err) => {
            showFailedToast()
            console.error(err);
        })
        .then(() => {
          setLoading(false)
        });
      }else{
        fetch(`${origin}/api/local?id=${local.id}`, {
          method: 'PUT',
          body: JSON.stringify(loc),
        })
          .then((response) => {
            if (response.status === 401) {
              showFailedToast()
              throw new Error('Could not edit local. Database is read-only');
            }
    
            /* if (response.status !== 201) {
              response.json().then((data) => {
                throw new Error(`Error Creating local: ${data.message}`);
              });
            } */
            return response;
          })
          .then((response) => response.json())
          .then((data) => {
            showSuccessToast()
            console.log("dta updated : ", data);
          })
          .catch((err) => {
            showFailedToast()
            console.error("errrror", err);
        })
        .then(() => {
          setLoading(false)
        });
      }
    //console.log(formValues);
  };

  const titleName = () => {
    if(local == null) 
      return "Ajouter un local" 
    else
      return "Modifier un local"
  }

  const parProprieteChange = e =>{
    values["locationtype"] = null
    values["montant"] = null
    values["source"] = null
    handleInputChange(e)
  }

  const occupationTypeChange = e =>{
    values["activite_principale"] = null
    values["categorie"] = null
    values["chiffre_affaire"] = null
    handleInputChange(e)
  }

  const occupeChange = e =>{
    values["activite_principale"] = null
    values["categorie"] = null
    values["chiffre_affaire"] = null
    values["locationtype"] = null
    values["montant"] = null
    values["source"] = null
    values["occupation_type"] = null
    values["occupe_par_proprietaire"] = null
    handleInputChange(e)
  }

  return (
    
        <BaseCard titleColor={"secondary"} title={titleName()}>
          {values &&
          <form onSubmit={handleSubmit} style={{paddingInline:'5%'}}>
          <br/>
          <Stack style={styles.stack} spacing={2} direction="row">

            <Controls.Input
              style={{width:'25%'}}
              id="reference-input"
              name="reference"
              label="Reférence"
              value={values.reference}
              onChange={handleInputChange}
              error={errors.reference}
            />
            <Controls.Input
              style={{width:'25%'}}
              id="posetage-input"
              name="posetage"
              label="Etage"
              value={values.posetage}
              onChange={handleInputChange}
              error={errors.posetage}
            />
            <Controls.Select
              style={{width:'25%'}}
              name="typeunite"
              label="Type"
              value={values.typeunite}
              onChange={handleInputChange}
              options={constructions}
            />  
            <Controls.Select
              style={{width:'25%'}}
              name="occupee"
              label="Occupé ? "
              value={values.occupee}
              onChange={occupeChange}
              options={booleans}
            />
          </Stack>
          {values.occupee === "Oui" &&
            <Stack style={styles.stack} spacing={2} direction="row">
                <Controls.Select
                  style={{width:'50%'}}
                  name="occupation_type"
                  label="Type d'occupation"
                  value={values.occupation_type}
                  onChange={occupationTypeChange}
                  options={occupations}
                />
                <Controls.Select
                  style={{width:'50%'}}
                  name="occupe_par_proprietaire"
                  label="Occupée par propriétaire ? "
                  value={values.occupe_par_proprietaire}
                  onChange={parProprieteChange}
                  options={booleans}
                />
            </Stack>
            }
        {values.occupee === "Oui" && values.occupe_par_proprietaire === "Non" &&
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Select
              style={{width:'33.33%'}}
              name="locationtype"
              label="Type de location"
              value={values.locationtype}
              onChange={handleInputChange}
              options={locationtypes}
            /> 
            <Controls.Input
              style={{width:'33.33%'}}
              id="montant-input"
              name="montant"
              label="Montant"
              type="number"
              value={values.montant}
              onChange={handleInputChange}
            />
            <Controls.Select
              style={ //getBorrower(values.borrower_id) != "SOGEM" ? {width:'45%'} : 
              {width:'33.33%'}}
              name="source"
              label="source"
              value={values.source}
              onChange={handleInputChange}
              options={sources}
            />
          </Stack>
        }
        {values.occupee === "Oui" && values.occupation_type === "Activité Commerçiale" &&
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'33.33%'}}
              id="activite_principale-input"
              name="activite_principale"
              label="Activité principale"
              value={values.activite_principale}
              onChange={handleInputChange}
            />
            <Controls.Select
              style={ //getBorrower(values.borrower_id) != "SOGEM" ? {width:'45%'} : 
              {width:'33.33%'}}
              name="categorie"
              label="Catégorie"
              value={values.categorie}
              onChange={handleInputChange}
              options={categories}
            />
            <Controls.Input
              style={{width:'33.33%'}}
              id="chiffre_affaire-input"
              name="chiffre_affaire"
              label="Chiffre d'affaire"
              type="number"
              value={values.chiffre_affaire}
              onChange={handleInputChange}
            />
          </Stack>
        }
          <br />
          <Stack style={styles.stack} spacing={2}>
          <Button
            type="submit"
            style={{ fontSize: "18px" }}
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
export default LocalForm;
