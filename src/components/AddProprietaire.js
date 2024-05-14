import React, { useState } from "react";
import {
  Stack,
  Button,
  CircularProgress
} from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import { Form } from "./Form";
import Controls from "./controls/Controls";


const ProprietaireForm = (props) => {
  const {proprietaire, showSuccessToast, showFailedToast} = props;

  const defaultValues = (proprietaire == null) ? {
    personne_juridique:"",            
    nom_prenom_raison_sociale:"",     
    nom_commerciale:"",               
    nni:"",                           
    registre_commerce:"",             
    nif:"",                           
    telephone:"",                     
    statut_telephone:""            
  } : proprietaire;

  const [formValues, setFormValues] = useState(defaultValues);
  const [loading, setLoading] = React.useState(false);
  const [zones, setZones] = React.useState([
    { id:"Administrative", label:"Administrative" },
    { id:"Commerciale"   , label:"Commerciale"    },
    { id:"Extension"   , label:"Extension"    },
    { id:"Pêche"      , label:"Pêche"       }
  ]);

  const [constructions, setConstructions] = React.useState([
    { id:"Appartement+Boutique"					,label:"Appartement+Boutique"						},
    { id:"Magasin/Boutique"		,label:"Magasin/Boutique"			},
    { id:"Hangar"					,label:"Hangar"						},
    { id:"Autre"					,label:"Autre"						}
  ]);

  const [types, setTypes] = React.useState([
    { id:"Batie", label:"Batie" },
    { id:"Non batie"   , label:"Non batie" }
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
    var prop = { ...values, 
      //proprietaire_photo_path2 : values.proprietaire_photo_path, 
      //proprietaire_photo_path : 'proprietaire_' + values.wilaya.replace(" ", "_") + "_" + values.moughataa.replace(" ", "_") + "_" + values.commune.replace(" ", "_") + "_" + values.ilot.replace(" ", "_").replace(" ", "_") + "_" + values.lot.toString() + "_" + values.lot_Suitt.replace(" ", "_") + ".jpeg", 
      //Date_Modiffication : new Date().toISOString()
    }
    //console.log("prop    :   "  ,prop);
    setLoading(true)
    if(proprietaire === null){
        fetch(`${origin}/api/proprietaire`, {
          method: 'POST',
          body: JSON.stringify(prop),
        })
          .then((response) => {
            if (response.status === 401) {
              showFailedToast()
              throw new Error('Could not edit proprietaire. Database is read-only');
            }
    
            if (response.status !== 201) {
              response.json().then((data) => {
                showFailedToast()
                throw new Error(`Error Creating proprietaire: ${data.message}`);
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
        fetch(`${origin}/api/proprietaire?id=${proprietaire.id}`, {
          method: 'PUT',
          body: JSON.stringify(prop),
        })
          .then((response) => {
            if (response.status === 401) {
              showFailedToast()
              throw new Error('Could not edit proprietaire. Database is read-only');
            }
    
            /* if (response.status !== 201) {
              response.json().then((data) => {
                throw new Error(`Error Creating proprietaire: ${data.message}`);
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
    if(proprietaire == null) 
      return "Ajouter une proprietaire" 
    else
      return "Modifier une proprietaire"
  }

  const genreInputChange = e =>{
    values["type_construction"] = null
    values["NB_etage"] = null
    values["NB_unite"] = null
    values["NB_Appartmnt_Boutique"] = null
    values["NB_villa"] = null
    values["NB_magasin_boutique"] = null
    values["NB_hangar"] = null
    values["NB_centre_commercial"] = null
    values["NB_autre"] = null 
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
              id="personne_juridique-input"
              name="personne_juridique"
              label="Personne juridique"
              value={values.personne_juridique}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'25%'}}
              id="nom_prenom_raison_sociale-input"
              name="nom_prenom_raison_sociale"
              label="Nom et prenom"
              value={values.nom_prenom_raison_sociale}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'25%'}}
              id="nom_commerciale-input"
              name="nom_commerciale"
              label="Nom commercial"
              value={values.nom_commerciale}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'25%'}}
              id="nni-input"
              name="nni"
              label="NNI"
              value={values.nni}
              onChange={handleInputChange}
            />
          </Stack>
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'25%'}}
              id="registre_commerce-input"
              name="registre_commerce"
              label="Registre commerce"
              value={values.registre_commerce}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'25%'}}
              id="nif-input"
              name="nif"
              label="nif"
              value={values.nif}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'25%'}}
              id="telephone-input"
              name="telephone"
              label="Telephone"
              value={values.telephone}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'25%'}}
              id="statut_telephone-input"
              name="statut_telephone"
              label="Statut telephone"
              value={values.statut_telephone}
              onChange={handleInputChange}
            />
          </Stack>
        {values.genre === "Batie" &&
          <Stack style={styles.stack} spacing={2} direction="row">

            <Controls.Input
              style={{width:'33.33%'}}
              id="NB_etage-input"
              name="NB_etage"
              label="Etage"
              type="number"
              value={values.NB_etage}
              onChange={handleInputChange}
            />
            <Controls.Input
              style={{width:'33.33%'}}
              id="NB_unite-input"
              name="NB_unite"
              label="Somme d'unités"
              type="number"
              value={values.NB_unite}
              onChange={handleInputChange}
            />

            <Controls.Input
              style={{width:'33.33%'}}
              id="NB_Appartmnt-input"
              name="NB_Appartmnt_Boutique"
              label="Nombre d'appartements et boutiques"
              type="number"
              value={values.NB_Appartmnt_Boutique}
              onChange={handleInputChange}
              //error={errors.NB_Appartmnt_Boutique}
            />
          </Stack>
        }
        {values.genre === "Batie" &&
          <Stack style={styles.stack} spacing={2} direction="row">
            <Controls.Input
              style={{width:'33.33%'}}
              id="NB_magasin_boutique-input"
              name="NB_magasin_boutique"
              label="Nombre magasins/boutiques"
              type="number"
              value={values.NB_magasin_boutique}
              onChange={handleInputChange}
            />
              <Controls.Input
                style={{width:'33.33%'}}
                id="NB_hangar-input"
                name="NB_hangar"
                label="Nombre hangar"
                type="number"
                value={values.NB_hangar}
                onChange={handleInputChange}
              />
            <Controls.Input
                style={{width:'33.33%'}}
                id="NB_autre-input"
                name="NB_autre"
                label="Nombre autre"
                type="number"
                value={values.NB_autre}
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
export default ProprietaireForm;
