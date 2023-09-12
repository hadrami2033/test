import { Alert, Button, CircularProgress, MenuItem, Snackbar, Tooltip } from "@mui/material";
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
import { useRouter } from "next/router";
import {ArrowBack, ArrowForward } from "@material-ui/icons";
import Select from '@mui/material/Select';
import { Box } from "@material-ui/core";
import EnhancedTableToolbar from "../src/components/Table/TableToolbar";
import useAxios from "../src/utils/useAxios";


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'reference',
    numeric: false,
    disablePadding: true,
    label: 'Reférence',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'start_date',
    numeric: false,
    disablePadding: false,
    label: 'Date début',
  },
  {
    id: 'end_date',
    numeric: false,
    disablePadding: false,
    label: 'Date fin',
  },
  {
    id: 'close_date',
    numeric: false,
    disablePadding: false,
    label: 'Date de Cloture',
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
  const [Commitments, setCommitments] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [getBy, setGetBy] = React.useState("")
  const [open, setOpen] = React.useState(false);
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
  const [authenticated, setAuthenticated] = React.useState(false);


  const router = useRouter()
  const axios = useAxios();

  React.useEffect(() => {
      setLoading(true)
      //var cMonth;
      /* apiService.getCurrentMonth().then(
        res => {
          cMonth = res.data
          console.log("current month : ", res.data);
          setCurrentMonth(res.data);
        },
        error => { console.log(error); }
      ).then( () => { */
        //console.log("time : ", cMonth);
        //if(cMonth){
          axios.get(`/commitments`).then(
              res => {
                console.log(res.data);
                setCommitments(res.data);
                //setHasNext(res.data.nextPage);
                //setHasPrevious(res.data.previousPage);
                //setTotalPages(res.data.TotalPages);
                //setAll(res.data.TotalCount);
              }, 
              error => console.log(error)
            )
          .then(() => {
            setLoading(false)
          })
       //}
      
      
    

  }, [pageNumber, pageSize, getBy, deleted])

  React.useEffect(() => {
   /*  if(!localStorage.getItem('user')){
      console.log("no user in loc storage :", localStorage.getItem('user'));
      router.push('/login')
    }else{
      console.log("user in loc storage :", localStorage.getItem('user'))
      setAuthenticated(true)
    } */
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

  const remove = () =>{
    if(selected !== null){
      axios.delete(`/commitments/${selected.id}`).then(
        res => {
          console.log(res);
          const index = Commitments.indexOf(selected);
          Commitments.splice(index, 1);
          setDelete(!deleted)
          handleCloseModalDelete()
          setSelected(null)
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

  const next = () => {
    setPageNumber(pageNumber+1)
  }
  const previous = () => {
    setPageNumber(pageNumber-1)
  }

  const editClick = () => {
    console.log("edit => ", selected);
    router.push({
      pathname: '/add_commitment',
      query: { id: selected.id }
    })
  }

  const addCommitment = () => {
    router.push({ pathname: '/add_commitment' })
  }

  const deleteClick = () => {
    console.log("delete => ", selected);
    handleOpenModalDelete()
  }

  const shooseField = (field)=> {
    if(selected !== null)
      return selected[field]
    return ""
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

  const isSelected = (id) => {
    console.log("idddd ", id);
    return selected !== null && selected.id === id; //selected.indexOf(id) !== -1;
  }

  const formatDate = (date) => {
    const dateFormat = new Date(date).getDate()+"/"+(new Date(date).getMonth()+1)+"/"+new Date(date).getFullYear();
    return dateFormat;
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

  const CommitmentDetail = () => {
    //setDetail(true);
    router.push({
      pathname: '/commitment_detail',
      query: { id: selected.id}
    })
  }

  return (<>
    {/* {authenticated &&} */}
    {/* {!detail ? */}
    <BaseCard titleColor={"secondary"} title="GESTION DES ENGAGEMENTS">

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
        detail = {CommitmentDetail}
        field = {shooseField("reference")} 
        selected = {selected}
        deleteClick = {deleteClick}
        editClick = {editClick}
        onSearch = {onSearch}
        search = {search}
        openModal = {addCommitment}
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
          {Commitments.length > 0 ?
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
                rowCount={Commitments.length}
                headCells={headCells}
                headerBG="#c8d789"
                txtColor="#000000"
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                  rows.slice().sort(getComparator(order, orderBy)) */}
                {Commitments
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        //aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        //selected={isItemSelected}
                      >
                        
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{ 
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>

                        <TableCell align="left">{row.reference}</TableCell>
                        <TableCell align="left">{row.status}</TableCell>
                        <TableCell align="left">{row.description}</TableCell>
                        <TableCell align="left">{formatDate(row.start_date)} </TableCell>
                        <TableCell align="left">{formatDate(row.end_date)} </TableCell>
                        <TableCell align="left">{formatDate(row.close_date)} </TableCell>


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
          {Commitments.length > 0 &&
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
                  <Button disabled={!hasPrevious} onClick={previous}>
                    <ArrowBack/>
                  </Button>
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
                <Button disabled={!hasNext} onClick={next} >
                  <ArrowForward/>
                </Button>
                </span>
              </Tooltip>
            </div>
          </div>
          }
    </BaseCard>
    {/* :
    <DetailCommitment clientsCount = {200 } numbersCount = {200 } Commitment = {selected} />
    } */}
  </>);
}
