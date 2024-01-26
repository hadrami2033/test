import { Alert, Button, CircularProgress, IconButton, MenuItem, Snackbar, Tooltip } from "@mui/material";
import BaseCard from "../src/components/baseCard/BaseCard";
import * as React from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHead from "../src/components/Table/TableHeader";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import { Box } from "@material-ui/core";
import EnhancedTableToolbar from "../src/components/Table/TableToolbar";
import { Close } from "@mui/icons-material";
import useAxios from "../src/utils/useAxios";
import { useContext } from "react";
import AuthContext from "../src/context/AuthContext";
import ReferenceMoneyForm from "./add_reference_money";

const headCells = [
    {
        id: 'code',
        numeric: false,
        disablePadding: false,
        label: 'Code',
    },
    {
        id: 'label',
        numeric: false,
        disablePadding: false,
        label: 'Libelé',
    },
    {
        id: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Description',
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
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deleted, setDelete] = React.useState(false);
  const [Currencies, setCurrencies] = React.useState([])
  const [referenceMoney, setReferenceMoney] = React.useState([])

  const axios = useAxios();
  const { logoutUser } = useContext(AuthContext);

  React.useEffect(() => {
      setLoading(true)
        axios.get(`/reference_money`).then(
              res => {
                console.log(res.data);
                setReferenceMoney(res.data);
              }, 
              error => {
                console.log(error)
                if(error.response && error.response.status === 401)
                logoutUser()
              }
            )
          .then(() => {
            setLoading(false)
          })
  }, [deleted])

  React.useEffect(() => {
    setLoading(true)
    axios.get(`/currencies`).then(
        res => {
          console.log("currencies", res.data);
          setCurrencies(res.data);
        }, 
        error => {
          console.log(error)
          if(error.response && error.response.status === 401)
          logoutUser()
        }
      )
    .then(() => {
      setLoading(false)
    })
  }, [])

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

  const push = (e) =>{
    //ReferenceMoney.push(e)
    axios.get(`/reference_money`).then(
        res => {
          console.log(res.data);
          setReferenceMoney(res.data);
        }, 
        error => console.log(error)
    )
  }

  const update = (e) =>{
    var objIndex = referenceMoney.findIndex((obj => obj.id == e.id));
    referenceMoney[objIndex] = e
  }

  const remove = () =>{
    if(selected !== null){
      axios.delete(`/reference_money/${selected.id}`).then(
        res => {
          console.log(res);
          const index = referenceMoney.indexOf(selected);
          referenceMoney.splice(index, 1);
          setDelete(!deleted)
          handleCloseModalDelete()
          setSelected(null)
          if(localStorage.getItem("moneyRef"))
          localStorage.removeItem("moneyRef")
          showSuccessToast()
        },
        error => {
          console.log(error)
          showFailedToast()
        }
      )      
    }
  }

  const handleClick = (event, row) => {
    console.log("select => ", row);
    if(!isSelected(row.id)){
      setSelected(row);
    }else{
      setSelected(null);
    }
  };

  const deleteClick = () => {
    console.log("delete => ", selected);
    handleOpenModalDelete()
  }

  const shooseField = (field)=> {
    if(selected !== null)
      return selected[field]
    return ""
  }

  const isSelected = (id) => {
    console.log("idddd ", id);
    return selected !== null && selected.id === id; //selected.indexOf(id) !== -1;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpen(false);
    }
  };

  const handleCloseModalDelete = () =>{
    setOpenDelete(false)
  }

  const handleOpenModalDelete = () =>{
    setOpenDelete(true)
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


  return (<>
    {/* {authenticated &&} */}
    {/* {!detail ? */}
    <BaseCard titleColor={"secondary"} title="Monnaie de référence">

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

      <Dialog fullWidth={true} maxWidth={'md'} open={open} onClose={handleClose}>
                <DialogContent>
                <div style={{display:"flex", justifyContent:"end"}}>
                    <IconButton onClick={handleClose}>
                    <Close fontSize='medium'/>
                    </IconButton>
                </div>
                <ReferenceMoneyForm
                    Money={selected}
                    currencies={Currencies}
                    push={push}
                    update={update}
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

      <EnhancedTableToolbar
        field = {shooseField("label")} 
        selected = {selected}
        deleteClick = {deleteClick}
        openModal = {referenceMoney.length > 0 ? null : handleClickOpen}
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
          {referenceMoney.length > 0 ?
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={'medium'}
            >
              <EnhancedTableHead
                selected={selected}
                order={order}
                orderBy={orderBy}
                onSelectAllClick ={null}
                onRequestSort={handleRequestSort}
                rowCount={referenceMoney.length}
                headCells={headCells}
                headerBG="#1A7795"
                txtColor="#DCDCDC"
              />
              <TableBody>
                {referenceMoney.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >

                        <TableCell padding="checkbox">
                          <Checkbox
                            color="secondary"
                            checked={isItemSelected}
                            inputProps={{ 
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">{row.code}</TableCell>
                        <TableCell align="left">{row.label}</TableCell>
                        <TableCell align="left">{row.description}</TableCell>
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
    </BaseCard>
  </>);
}
