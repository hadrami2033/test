import { Alert, Button, CircularProgress, IconButton, MenuItem, Snackbar, Tooltip } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import * as React from 'react';
import { useEffect } from "react";
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EnhancedTableHead from "../src/components/Table/TableHeader";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import { useRouter } from "next/router";
import {ArrowBack, ArrowForward } from "@material-ui/icons";
import Select from '@mui/material/Select';
import { Box } from "@material-ui/core";
import EnhancedTableToolbar from "../src/components/Table/TableToolbar";
import useAxios from "../src/utils/useAxios";
import { Check, Close, Delete, Edit } from "@mui/icons-material";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useContext } from "react";
import AuthContext from "../src/context/AuthContext";
import jwt_decode from "jwt-decode";
import UserForm from "./user_form";

const headCells = [
  {
    id: 'username',
    numeric: false,
    disablePadding: false,
    label: 'Utilisateur',
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'date_joined',
    numeric: false,
    disablePadding: false,
    label: 'Date de création',
  },
  {
    id: 'is_active',
    numeric: false,
    disablePadding: false,
    label: 'Statut',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  } 
];

EnhancedTableHead.propTypes = {
  //numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  //onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

EnhancedTableToolbar .propTypes = {
  //selected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('username');
  const [user, setUser] = React.useState({});
  const [Users, setUsers] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [getBy, setGetBy] = React.useState("")
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [hasPrevious, setHasPrevious] = React.useState(false);
  const [hasNext, setHasNext] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [all, setAll] = React.useState(0);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deleted, setDelete] = React.useState(false);
  const [openEditState, setOpenEditState] = React.useState(false);
  const [openModalUser, setOpenModalUser] = React.useState(false);

  const { authTokens } = useContext(AuthContext);
  const User = authTokens ? jwt_decode(authTokens.access) : {};

  const router = useRouter()
  const axios = useAxios();

  useEffect(() => {
    if(User.role === "Admin")
    getUsers()
    else
    router.push('/')
  }, [pageNumber, pageSize, getBy, deleted])

  const getUsers = () => {
    setLoading(true)
    axios.get(`/users`).then(
      res => {
        console.log(res.data);
        setUsers(res.data);
        //setHasNext(res.data.nextPage);
        //setHasPrevious(res.data.previousPage);
        //setTotalPages(res.data.TotalPages);
        //setAll(res.data.TotalCount);
      }, 
      error => console.log(error)
    ).then(() => {
      setLoading(false)
    })
  }
  /*React.useEffect(() => {
     if(!localStorage.getItem('user')){
      console.log("no user in loc storage :", localStorage.getItem('user'));
      router.push('/login')
    }else{
      console.log("user in loc storage :", localStorage.getItem('user'))
      setAuthenticated(true)
    } 
  }, [])*/

  const showFailedToast = () => {
    setOpenFailedToast(true);
  };

  const showSuccessToast = () => {
    setOpenSuccessToast(true);
  };

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const remove = () =>{
      axios.delete(`/users/${user.id}`).then(
        res => {
          console.log(res);
          //const index = Users.indexOf(user);
          //Users.splice(index, 1);
          setDelete(!deleted)
          showSuccessToast()
        },
        error => {
          console.log(error)
          showFailedToast()
        }
      ).then(
        handleCloseModalDelete()
      )      
  }

  const next = () => {
    setPageNumber(pageNumber+1)
  }
  const previous = () => {
    setPageNumber(pageNumber-1)
  }

  const onSearch = e => {
    const { value } = e.target
    setSearch(value)
    if(value === ""){
      setGetBy("")
    }
  }

  const goSearch = () => {
    console.log(search);
    setGetBy(search)
  }

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

  const handleCloseModalUser = () =>{
    setOpenModalUser(false)
    getUsers()
  }

  const handleOpenModalUser = () =>{
    setOpenModalUser(true)
  }

  const handleCloseModalDelete = () =>{
    setOpenDelete(false)
  }

  const handleOpenModalDelete = (row) =>{
    console.log(row);
    setUser(row)
    setOpenDelete(true)
  }

  const handleCloseModalEditState = () =>{
    setOpenEditState(false)
  }

  const handleOpenModalEditState = (row) =>{
    setUser(row)
    setOpenEditState(true)
  }

  const handleSelectSizeChange = (event) => {
    setPageSize(event.target.value);
  };

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

  const userState = () => {
    if(user.is_active)
    return "Suspension d'un utilisateur"
    else return "Activation d'un utilisateur"
  }

  const editState = () => {
    axios.put(`/users/${user.id}`, { ...user, is_active : !user.is_active }).then(
        (res) => {
          console.log("updated => ", res);
          if(!res.data){
            showFailedToast()
          }else{
            showSuccessToast()
          }
          getUsers()
          handleCloseModalEditState()
        },
        (error) => {
          console.log(error);
          showFailedToast()
          handleCloseModalEditState()
        } 
      )
  }

  const editUser = (row) => {
    console.log(row);
  }

  return (<>
    {/* {authenticated &&} */}
    {/* {!detail ? */}
    <BaseCard titleColor={"secondary"} title="GESTION DES UTILISATEURS">

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

      <Dialog fullWidth={true} open={openModalUser} onClose={handleCloseModalUser}>
        <DialogContent>
          <div style={{display:"flex", justifyContent:"end"}}>
            <IconButton onClick={handleCloseModalUser}>
              <Close fontSize='large'/>
            </IconButton>
          </div>
          <UserForm
            //user = {user}
            showSuccessToast={showSuccessToast}
            showFailedToast={showFailedToast}
          />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={openDelete}
        onClose={handleCloseModalDelete}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move', display:"flex" ,justifyContent:"end" , fontSize:"24px",fontWeight:"bold" }} id="draggable-dialog-title">
          Suppression
        </DialogTitle>
        <DialogContent style={{width:300,display:"flex" ,justifyContent:"center" }}>
          <DialogContentText>
            Confirmer la suppression
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} autoFocus onClick={handleCloseModalDelete}>
            Annuler
          </Button>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} onClick={remove}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openEditState}
        onClose={handleCloseModalEditState}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move', display:"flex" ,justifyContent:"end" , fontSize:"24px",fontWeight:"bold" }} id="draggable-dialog-title">
        {/* Activation/Suspension d'un utilisateur */}
        {userState()}
        </DialogTitle>
        <DialogContent style={{width:300,display:"flex" ,justifyContent:"center" }}>
          <DialogContentText>
            Confirmer le changement de statut
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} autoFocus onClick={handleCloseModalEditState}>
            Annuler
          </Button>
          <Button style={{fontSize:"24px",fontWeight:"bold"}} onClick={editState}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>

      <EnhancedTableToolbar
        onSearch = {onSearch}
        search = {search}
        openModal = {handleOpenModalUser}
        goSearch = {goSearch}
      />
       <TableContainer>
       
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
          <>
          {Users.length > 0 ?
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={Users.length}
                headCells={headCells}
                headerBG="#1A7795"
                txtColor="#DCDCDC"
              />
              <TableBody>
                {Users.filter(e => e.username != User.username && e.username != "Binor" )
                  .map((row, index) => {
                    //const isItemSelected = isSelected(row.id);
                    //const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        //hover
                        //onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        //aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        //selected={isItemSelected}
                      >
                        
                        <TableCell padding="checkbox">
                          {/* <Checkbox
                            color="secondary"
                            checked={isItemSelected}
                            inputProps={{ 
                              'aria-labelledby': labelId,
                            }}
                          /> */}
                        </TableCell>
                        <TableCell align="left" style={{fontWeight:"bold"}} >{row.username}</TableCell>
                        <TableCell align="left">{row.role}</TableCell>
                        <TableCell align="left">{formatDate(row.date_joined)} </TableCell>
                        <TableCell align="left"> 
                            {row.is_active ?
                             'Active'
                            :
                             'Suspendu'
                            }
                        </TableCell>
                        <TableCell align="left"> 
                            <Box style={{display:"flex", flexDirection:"row"}} >
                                {!row.is_active ?
                                    <Tooltip onClick={() => handleOpenModalEditState(row)} title="Activer">
                                        <IconButton>
                                            <Check fontSize='medium' color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <Tooltip onClick={() => handleOpenModalEditState(row)} title="Suspender">
                                        <IconButton>
                                            <DoDisturbIcon fontSize='medium' color="danger" />
                                        </IconButton>
                                    </Tooltip>
                                }
                                <Tooltip onClick={() => editUser(row)} title="Modifier">
                                    <IconButton>
                                        <Edit fontSize='medium' color="action" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip onClick={() => handleOpenModalDelete(row)} title="Supprimer">
                                    <IconButton>
                                        <Delete fontSize='medium' color="secondary" />
                                    </IconButton>
                                </Tooltip>
                            </Box> 
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          :
          <div style={{width: "100%", marginTop: '20px', display: 'flex', justifyContent: "center"}}>
            <Box style={{fontSize: '16px'}}>
        Liste vide
            </Box>
          </div>
          }
          </>
        }
        </TableContainer>
          {Users.length > 0 &&
          <div style={{width: "100%", marginTop: '20px', display: 'flex', justifyContent: "space-between"}}>
            <div style={{width:"50%", display:'flex', alignItems:'center'}}>
              <Box style={{display:'flex', alignItems:'center', marginInline:"20px", fontWeight:'bold', color:"GrayText"}} >
              Total : {all}
              </Box>
            </div>
            <div style={{width:"50%", display:'flex', alignItems:'center', justifyContent:"end"}}>
              <Box style={{display:'flex', alignItems:'center', marginInline:"20px", fontWeight:'normal', color:"GrayText"}} >
                {pageNumber}/{totalPages}
              </Box>

              <Tooltip title="Précédente">
               <span>
                <IconButton disabled={!hasPrevious} onClick={previous}>
                  <ArrowBack/>
                </IconButton>
                </span>
              </Tooltip>

              <Select
                id="page-size-select"
                value={pageSize}
                onChange={handleSelectSizeChange }
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
                <IconButton disabled={!hasNext} onClick={next} >
                  <ArrowForward/>
                </IconButton>
                </span>
              </Tooltip>
            </div>
          </div>
          }
    </BaseCard>
    {/* :
    <DetailUser clientsCount = {200 } numbersCount = {200 } User = {selected} />
    } */}
  </>);
}
