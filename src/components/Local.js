import React, { useEffect } from "react";
import { Typography, Grid, Box, CircularProgress } from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import PropTypes from 'prop-types';
import { useRouter } from "next/router";


function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };



const Local = (props) => {
  const {id, origin, c} = props;

  const [Local, setLocal] = React.useState(null);
  const [Contribuable, setContribuable] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter()

  useEffect(() => {
    const fetchLocal = () => {
      setLoading(true)
      if(id){
        fetch(
          `${origin}/api/local${
            `?id=${id}&limit=20` 
          }`,
          {
            method: 'GET',
          }
        )
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            if (data.message === 'Query failed: planning failure') {
              throw new Error(
                `Query Failed. Be sure to run \`npm run build-indexes\`!`
              );
            }
            if (
              data.message === 'Query failed: bucket not found' ||
              data.message === 'Query failed: parsing failure'
            ) {
              throw new Error(
                data.message +
                  '\n' +
                  'Be sure to use a bucket named `_default`, a scope named `_default`, and a collection named `_default`' +
                  '\n' +
                  'See the "Common Pitfalls and FAQ" section of the README for more information.'
              );
            }

            throw new Error(data.message);
          }      
          setLocal(data[0])
        })
        .then(() => {
          if(c && c.length > 0)
          fetch(
            `${origin}/api/proprietaire${
              `?id=${c}&limit=20` 
            }`,
            {
              method: 'GET',
            }
          )
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              if (data.message === 'Query failed: planning failure') {
                throw new Error(
                  `Query Failed. Be sure to run \`npm run build-indexes\`!`
                );
              }
              if (
                data.message === 'Query failed: bucket not found' ||
                data.message === 'Query failed: parsing failure'
              ) {
                throw new Error(
                  data.message +
                    '\n' +
                    'Be sure to use a bucket named `_default`, a scope named `_default`, and a collection named `_default`' +
                    '\n' +
                    'See the "Common Pitfalls and FAQ" section of the README for more information.'
                );
              }
  
              throw new Error(data.message);
            }      
            console.log(data);
            setContribuable(data[0])
          })
        })
        .then(() => {
          setLoading(false)
        });
      }else{
        router.push("/proprietes")
      }
    };
    fetchLocal();
  }, [])

  const formatDate = (date) => {
    if(date){
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      return [ day, month, year ].join('-');
    }else return null
  }

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });

  const imgExist = (path) => {
    var isExist = false;
    fetch(path)
      .then((res) => {
        if(res.status === 200) isExist = true
    })
    return isExist;
  }

  return (
    <BaseCard titleColor={"secondary"} title={ Local ? Local.typeunite + " " + Local.reference: ""}>
        {loading ?
          <Box style={{width:'100%', display:'flex', justifyContent:"center" }}>
            <CircularProgress
              size={24}
                sx={{
                color: 'primary',
                position: 'absolute',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
         </Box>
        :
          <Box style={{width:'100%'}}>
            
            {Local &&
            <Grid container spacing={2} >
              
                      <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                        <img style={{maxWidth: '100%', maxHeight: '800px'}}  src={imgExist('/static/images/'+Local.local_photo_path) ? 
                        '/static/images/'+Local.local_photo_path : 'data:image/png;base64,'+Local.local_photo} alt={Local.local_photo_path} />         
                      </Grid> 
                  
                      {!imgExist('/static/images/'+Local.local_photo_path) &&
                        <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                            <Typography
                                color= "#e46a76"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            L'image de qualité optimale n'existe pas sous le nom :  
                            </Typography>
                            <Typography
                                color= "#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                              {" : " +Local.local_photo_path}
                            </Typography>
                        </Grid> 
                      } 
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Date de création : {formatDate(Local.date_creation)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Date de modification : {formatDate(Local.date_modification)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Occupée : {Local.occupee} 
                            </Typography>
                        </Grid>
                        {Local.occupee != "Non" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Par proprietaire ? : {Local.occupe_par_proprietaire}
                            </Typography>
                        </Grid>
                        }
                        {Local.occupee != "Non" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Type d'occupation : {Local.occupation_type}
                            </Typography>
                        </Grid>
                        }
                        {Local.occupee != "Non" && Local.occupe_par_proprietaire === "Non" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Type de location : {Local.locationtype}
                            </Typography>
                        </Grid>
                        }
                        {Local.occupee != "Non" && Local.occupe_par_proprietaire === "Non" &&

                        <Grid item xs={4}>
                            <Typography
                              color="#837B7B"
                              sx={{
                                  fontStyle:'initial'
                              }}
                            >
                            Montant mansuel : {pounds.format(Local.montant)} MRU
                            </Typography>
                        </Grid>
                        }
                        {Local.occupee != "Non" && Local.occupation_type != "Habitation" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Activité principale : {Local.activite_principale}
                            </Typography>
                        </Grid>
                        }
                        {Local.occupee != "Non" && Local.occupation_type != "Habitation" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Chiffre d'affaire : {Local.chiffre_affaire}
                            </Typography>
                        </Grid>
                        }
                        {Local.occupee != "Non" && Local.occupation_type != "Habitation" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Catégorie : {Local.categorie}
                            </Typography>
                        </Grid>
                        }

                      {Contribuable &&
                        <Grid container spacing={2} marginLeft={'1px'} marginTop={'2px'} >
                          <Grid item xs={12}>
                              <Typography
                                  color="#837B7B"
                                  sx={{
                                  fontWeight :"bold",
                                  fontStyle:'initial'
                                  }}
                              >
                              Exploitant : 
                              </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Nom : {Contribuable.nom_prenom_raison_sociale}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Type : {Contribuable.personne_juridique}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Nom commerciale : {Contribuable.nom_commerciale}
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Teléphone : {Contribuable.telephone}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Etat teléphone : {Contribuable.statut_telephone}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            NNI : {Contribuable.nni}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                  fontStyle:'initial'
                                }}
                            >
                            NIF : {Contribuable.nif}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Quittance : {Contribuable.numeroQuittance}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Registre de commerce : {Contribuable.registre_commerce}
                            </Typography>
                        </Grid>

                      {Contribuable.cni_photo_path.length > 0 &&
                        <>
                        <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                          <img style={{maxWidth: '100%', maxHeight: '800px'}}  src={imgExist('/static/images/'+Contribuable.cni_photo_path) 
                            ? '/static/images/'+Contribuable.cni_photo_path : 'data:image/png;base64,'+Contribuable.cni_photo} alt={Contribuable.cni_photo_path} />         
                        </Grid> 

                        {!imgExist('/static/images/'+Contribuable.cni_photo_path) &&
                          <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                            <Typography
                                color= "#e46a76"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            L'image de qualité optimale n'existe pas sous le nom :  
                            </Typography>
                            <Typography
                                color= "#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                              {" : " +Contribuable.cni_photo_path}
                            </Typography>
                          </Grid> 
                        }
                        </>
                      }

                      {Contribuable.rc_photo_path.length > 0 &&
                        <>
                        <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                          <img style={{maxWidth: '100%', maxHeight: '800px'}}  src={imgExist('/static/images/'+Contribuable.rc_photo_path) 
                            ? '/static/images/'+Contribuable.rc_photo_path : 'data:image/png;base64,'+Contribuable.rc_photo} alt={Contribuable.rc_photo_path} />         
                        </Grid> 

                        {!imgExist('/static/images/'+Contribuable.rc_photo_path) &&
                          <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                            <Typography
                                color= "#e46a76"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            L'image de qualité optimale n'existe pas sous le nom :  
                            </Typography>
                            <Typography
                                color= "#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                              {" : " +Contribuable.rc_photo_path}
                            </Typography>
                          </Grid> 
                        }
                        </>
                      }

                      {Contribuable.quittance_photo_path.length > 0 &&
                        <>
                        <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                          <img style={{maxWidth: '100%', maxHeight: '800px'}}  src={imgExist('/static/images/'+Contribuable.quittance_photo_path) 
                            ? '/static/images/'+Contribuable.quittance_photo_path : 'data:image/png;base64,'+Contribuable.quittance_photo} alt={Contribuable.quittance_photo_path} />         
                        </Grid> 

                        {!imgExist('/static/images/'+Contribuable.quittance_photo_path) &&
                          <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                            <Typography
                                color= "#e46a76"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            L'image de qualité optimale n'existe pas sous le nom :  
                            </Typography>
                            <Typography
                                color= "#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                              {" : " +Contribuable.quittance_photo_path}
                            </Typography>
                          </Grid> 
                        }
                        </>
                      }


                        </Grid>
                      }


            </Grid>
            }
            
          </Box>
        }
    </BaseCard>

  );
};

export default Local;
