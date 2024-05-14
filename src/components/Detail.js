import React, { useEffect } from "react";
import { Alert, Typography, Button, Grid, Tooltip, Stack,Snackbar, Box, CircularProgress, Fab, Paper, MenuItem, Select  } from "@mui/material";
import BaseCard from "./baseCard/BaseCard";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import EnhancedTableHead from "./Table/TableHeader";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import { Add, CreateOutlined, Delete, InfoOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from "next/router";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
//import {fs} from 'fs'

//const fs = require("fs");

const headCells = [
  {
    id: 'reference',
    numeric: false,
    disablePadding: true,
    label: 'Reférence',
  },
  {
    id: 'activite_principale',
    numeric: false,
    disablePadding: false,
    label: 'Activité principale',
  },
  {
    id: 'typeunite',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'occupee',
    numeric: false,
    disablePadding: false,
    label: 'Occupée',
  },
  {
    id: 'posetage',
    numeric: false,
    disablePadding: false,
    label: 'Position',
  },
  {
    id: 'date_creation',
    numeric: false,
    disablePadding: false,
    label: 'Date création',
  },
  {
    id: 'categorie',
    numeric: false,
    disablePadding: false,
    label: 'Catégorie',
  },
  /* {
    id: 'chiffre_affaire',
    numeric: false,
    disablePadding: false,
    label: "Chiffre d'affaire",
  }, */
  {
    id: 'action',
    numeric: false,
    disablePadding: true,
    label: 'Action',
  }
];

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


const Detail = (props) => {
  const {id, origin} = props;

  const [Propriete, setPropriete] = React.useState(null);
  const [Proprietaire, setProprietaire] = React.useState(null);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deleted, setDelete] = React.useState(false);
  const [toDelete, setToDelete] = React.useState(null);
  const [locaux, setLocaux] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(10);
  const [skip, setSkip] = React.useState(0);
  const [openDelete, setOpenDelete] = React.useState(false);

  const router = useRouter()

  useEffect(() => {
    const fetchPropriete = () => {
      setLoading(true)
      if(id){
        fetch(
          `${origin}/api/propriete${
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
          setPropriete(data[0])
        })
        .then(() => {
          fetch(
            `${origin}/api/proprietaire${
              `?propriete=${id}&limit=20` 
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
            setProprietaire(data[0])
          })
        })
        .then(() => {
          fetch(
            `${origin}/api/local${
              `?propriete=${id}&limit=${pageSize}&skip=${skip}` 
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
            console.log("locaux  :  ", data);
            setLocaux(data)
          })
        })
        .then(() => {
          setLoading(false)
        });
      }else{
        router.push("/proprietes")
      }
    };
    fetchPropriete();
  }, [deleted, skip, pageSize])

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

  const closeFailedToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenFailedToast(false);
  };

  const closeSuccessToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccessToast(false);
  };

  const showFailedToast = () => {
    setOpenFailedToast(true);
  };

  const showSuccessToast = () => {
    setOpenSuccessToast(true);
  };

  const detailLocal = (local) => {
    //setDetail(true);
    router.push({
      pathname: '/local',
      query: { id: local.id, c: local.contribuable }
    })
  }

  const editLocal = (selected) => {
    console.log("edit => ", selected);
    router.push({
      pathname: '/add_local',
      query: { id: selected.id }
    })
  }

  const addLocal = () => {
    router.push({ 
      pathname: '/add_local',
      query: { propriete: Propriete.id }
    })
  }

  const handleOpenModalDelete = () =>{
    setOpenDelete(true)
  }

  const deleteLocal = (row) => {
    setToDelete(row)
    handleOpenModalDelete()
  }

  const remove = () =>{
    if(toDelete !== null){
      fetch(`${origin}/api/local?id=${toDelete.id}`, { method: 'DELETE' })
      .then((response) => {
        if (response.status === 401) {
          showFailedToast()
          throw new Error('Could not edit doc. Database is read-only');
        }
  
        if (response.status !== 200) {
          showFailedToast()
          throw new Error(`Error Deleting doc : ${response.message}`);
        }
        return response;
      })
      .then((response) => response.json())
      .then(() => {
        setDelete(!deleted);
        setToDelete(null);
        handleCloseModalDelete();
        showSuccessToast();
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }



  const PaperComponent = (props) => {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  } 
  const handleCloseModalDelete = () =>{
    setOpenDelete(false)
  }




 

 

  const handleSelectSizeChange = (event) => {
    setSkip(0)
    return setPageSize(event.target.value);
  };

  const next = () => {
    setSkip(skip+pageSize)
  }
  const previous = () => {
    setSkip(skip-pageSize)
  }


  const imgExist = (path) => {
    var isExist = false;
    fetch(path)
      .then((res) => {
        if(res.status === 200) isExist = true
        //else return false
    })
    //console.log("is exist : ", isExist);
    return isExist;
  }

  return (
    <BaseCard titleColor={"secondary"} title={ Propriete ? Propriete.zone + " " + Propriete.lot + "_" + Propriete.lot_Suitt: ""}>
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

      <Dialog 
        open={openDelete}
        onClose={handleCloseModalDelete}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move', display:"flex" ,justifyContent:"end" , fontSize:"24px",fontWeight:"bold" }} id="draggable-dialog-title">
          Suppression de local
        </DialogTitle>
        <DialogContent style={{width:300,display:"flex" ,justifyContent:"center" }}>
          <DialogContentText>
            Confirmer l'oppération
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} autoFocus onClick={handleCloseModalDelete}>
            Annuler
          </Button>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} onClick={remove}>Supprimer</Button>
        </DialogActions>
      </Dialog>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openSuccessToast} autoHideDuration={6000} onClose={closeSuccessToast}>
                <Alert onClose={closeSuccessToast} severity="success" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
                    L'oppération réussie
                </Alert>
            </Snackbar>

            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openFailedToast} autoHideDuration={6000} onClose={closeFailedToast}>
                <Alert onClose={closeFailedToast} severity="error" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
                    L'oppération a échoué !
                </Alert>
            </Snackbar>      

            {Propriete &&
            <Grid container spacing={2} >
                      <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                        <img style={{maxWidth: '100%', maxHeight: '800px'}}  src={imgExist('/static/images/'+Propriete.propriete_photo_path) ? '/static/images/'+Propriete.propriete_photo_path : 'data:image/png;base64,'+Propriete.propriete_photo} alt={Propriete.propriete_photo_path} />         
                      </Grid> 
                  
                      {!imgExist('/static/images/'+Propriete.propriete_photo_path) &&
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
                              {" : " +Propriete.propriete_photo_path}
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
                            Date de création : {formatDate(Propriete.Date_Creaction)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Date de modification : {formatDate(Propriete.Date_Modiffication)}
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{color:"#837B7B", fontWeight: "bold"}} >
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Genre : {Propriete.genre} 
                            </Typography>
                        </Grid>
                        {Propriete.genre != "Non batie" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Nombre d'etages : {Propriete.NB_etage}
                            </Typography>
                        </Grid>
                        }
                        {Propriete.genre != "Non batie" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Nombre d'unités : {Propriete.NB_unite}
                            </Typography>
                        </Grid>
                        }
                        {Propriete.genre != "Non batie" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Appartements et boutique : {Propriete.NB_Appartmnt_Boutique}
                            </Typography>
                        </Grid>
                        }
                        {Propriete.genre != "Non batie" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Magasins et boutique : {Propriete.NB_magasin_boutique}
                            </Typography>
                        </Grid>
                        }
                        {Propriete.genre != "Non batie" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Hangars : {Propriete.NB_hangar}
                            </Typography>
                        </Grid>
                        }

                        {Propriete.genre != "Non batie" &&
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Autres : {Propriete.NB_autre}
                            </Typography>
                        </Grid>
                        }

                      {Proprietaire &&
                        <Grid container spacing={2} marginLeft={'1px'} marginTop={'2px'} >
                          <Grid item xs={12}>
                              <Typography
                                  color="#837B7B"
                                  sx={{
                                  fontWeight :"bold",
                                  fontStyle:'initial'
                                  }}
                              >
                              Propriétaire : 
                              </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Nom : {Proprietaire.nom_prenom_raison_sociale}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Type : {Proprietaire.personne_juridique}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Nom commerciale : {Proprietaire.nom_commerciale}
                            </Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Teléphone : {Proprietaire.telephone}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Etat teléphone : {Proprietaire.statut_telephone}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            NNI : {Proprietaire.nni}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                  fontStyle:'initial'
                                }}
                            >
                            NIF : {Proprietaire.nif}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Quittance : {Proprietaire.numeroQuittance}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography
                                color="#837B7B"
                                sx={{
                                fontStyle:'initial'
                                }}
                            >
                            Registre de commerce : {Proprietaire.registre_commerce}
                            </Typography>
                        </Grid>

                        {Proprietaire.cni_photo_path.length > 0 &&
                        <>
                        <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                          <img style={{maxWidth: '100%', maxHeight: '800px'}}  src={imgExist('/static/images/'+Proprietaire.cni_photo_path) 
                            ? '/static/images/'+Proprietaire.cni_photo_path : 'data:image/png;base64,'+Proprietaire.cni_photo} alt={Proprietaire.cni_photo_path} />         
                        </Grid> 

                        {!imgExist('/static/images/'+Proprietaire.cni_photo_path) &&
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
                              {" : " +Proprietaire.cni_photo_path}
                            </Typography>
                          </Grid> 
                        }
                        </>
                        }

                      {Proprietaire.contrat_photo_path.length > 0 &&
                        <>
                        <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                          <img style={{maxWidth: '100%', maxHeight: '800px'}}  src={imgExist('/static/images/'+Proprietaire.contrat_photo_path) 
                            ? '/static/images/'+Proprietaire.contrat_photo_path : 'data:image/png;base64,'+Proprietaire.contrat_photo} alt={Proprietaire.contrat_photo_path} />         
                        </Grid> 

                        {!imgExist('/static/images/'+Proprietaire.contrat_photo_path) &&
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
                              {" : " +Proprietaire.contrat_photo_path}
                            </Typography>
                          </Grid> 
                        }
                        </>
                      }

                      {Proprietaire.rc_photo_path.length > 0 &&
                        <>
                        <Grid item xs={12} sx={{color:"#837B7B", fontWeight: "bold", display: 'flex', justifyContent :'center'}} >
                          <img style={{maxWidth: '100%', maxHeight: '800px'}}  src={imgExist('/static/images/'+Proprietaire.rc_photo_path) 
                            ? '/static/images/'+Proprietaire.rc_photo_path : 'data:image/png;base64,'+Proprietaire.rc_photo} alt={Proprietaire.rc_photo_path} />         
                        </Grid> 

                        {!imgExist('/static/images/'+Proprietaire.rc_photo_path) &&
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
                              {" : " +Proprietaire.rc_photo_path}
                            </Typography>
                          </Grid> 
                        }
                        </>
                        }
                        </Grid>
                      }


            </Grid>
            }
            
            
            
              <Grid item xs={12} marginLeft={4} marginTop={2}>
                  <Typography
                      color="#837B7B"
                      sx={{
                      fontWeight :"bold",
                      fontStyle:'initial'
                      }}
                  >
                  Locaux : 
                  </Typography>
              </Grid>

              <Stack spacing={2} direction="row" mb={2} ml={4} mt={2} >
                <Tooltip title="Ajouter">
                  <Fab color="secondary" size="small" aria-label="Ajouter" onClick={addLocal}>
                    <Add/>
                  </Fab>
                </Tooltip>
              </Stack>
              {locaux.length > 0 ?
              <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                        >
                        <EnhancedTableHead
                            rowCount={locaux.length}
                            headCells={headCells}
                            headerBG="#1A7795"
                            txtColor="#DCDCDC"
                        />
                        <TableBody>
                            {locaux
                            .map((row, index) => {
                                return (
                                <TableRow
                                    hover
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    
                                  <TableCell align="left"></TableCell>
                                  <TableCell align="left">{row.reference}</TableCell>
                                  <TableCell align="left">{row.activite_principale}</TableCell>
                                  <TableCell align="left">{row.typeunite}</TableCell>
                                  <TableCell align="left">{row.occupee}</TableCell>
                                  <TableCell align="left">{row.posetage}</TableCell>
                                  <TableCell align="left">{formatDate(row.date_creation)} </TableCell>
                                  <TableCell align="left">{row.categorie}</TableCell>
                                  {/* <TableCell align="left">{row.chiffre_affaire}</TableCell>
 */}
                                  <TableCell align="left">
                                     <Tooltip onClick={() => editLocal(row)} title="Modifier">
                                         <IconButton>
                                             <CreateOutlined fontSize='small' />
                                         </IconButton>
                                     </Tooltip>
                                     <Tooltip onClick={() => detailLocal(row)} title="Detail">
                                         <IconButton>
                                             <InfoOutlined color='primary' fontSize='small' />
                                         </IconButton>
                                     </Tooltip>
                                     <Tooltip onClick={() => deleteLocal(row)} title="Supprimer">
                                         <IconButton>
                                             <Delete color='danger' fontSize='small' />
                                         </IconButton>
                                     </Tooltip>
                                  </TableCell>


                                </TableRow>
                                );
                            })}
                        </TableBody>
              </Table>
              :
              <div style={{width: "100%", marginTop: '20px', display: 'flex', justifyContent: "center"}}>
                  <Box style={{fontSize: '12px'}}>
                    Liste de locaux vide
                  </Box>
              </div>
              }
          <div style={{width: "100%", marginTop: '20px', display: 'flex', justifyContent: "space-between"}}>
            <div style={{width:"50%", display:'flex', alignItems:'center'}}>
             
            </div>
            <div style={{width:"50%", display:'flex', alignItems:'center', justifyContent:"end"}}>
              <Tooltip title="Précédente">
                <span>
                  <IconButton disabled={skip===0} onClick={previous}>
                    <ArrowBack/>
                  </IconButton>
                </span>
              </Tooltip>

              <Select
                id="page-size-select"
                value={pageSize}
                onChange={handleSelectSizeChange}
                label="pageSize"
              >
                <MenuItem value={pageSize}>
                  <em>{pageSize}</em>
                </MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>  

              <Tooltip title="Suivante">
                <span>
                <IconButton disabled={locaux.length < pageSize} onClick={next} >
                  <ArrowForward/>
                </IconButton>
                </span>
              </Tooltip>
            </div>
       </div>
          </Box>
        }
    </BaseCard>

  );
};

export default Detail;
