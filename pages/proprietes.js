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
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHead from "../src/components/Table/TableHeader";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import { useRouter } from "next/router";
import {ArrowBack, ArrowForward, CreateOutlined, Delete, InfoOutlined } from "@material-ui/icons";
import Select from '@mui/material/Select';
import { Box } from "@material-ui/core";
import EnhancedTableToolbar from "../src/components/Table/TableToolbar";

const headCells = [
  {
    id: 'zone',
    numeric: false,
    disablePadding: false,
    label: 'Zone',
  },
  {
    id: 'lot',
    numeric: false,
    disablePadding: false,
    label: 'Lot',
  },
  {
    id: 'lot_Suitt',
    numeric: false,
    disablePadding: false,
    label: 'Lot suit',
  },
  {
    id: 'genre',
    numeric: false,
    disablePadding: false,
    label: 'Genre',
  },
  {
    id: 'Date_Creaction',
    numeric: false,
    disablePadding: false,
    label: 'Date de création',
  },
  {
    id: 'agent',
    numeric: false,
    disablePadding: false,
    label: 'Agent',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  }/* ,
  {
    id: 'end_date_grace_period',
    numeric: false,
    disablePadding: false,
    label: 'Fin du grace période',
  } */
  
];

EnhancedTableHead.propTypes = {
  //numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  //onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

/* EnhancedTableToolbar .propTypes = {
  //selected: PropTypes.number.isRequired,
}; */

export default function EnhancedTable({origin}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState(null);
  const [Proprietes, setProprietes] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [lot, setLot] = React.useState("")
  const [getBy, setGetBy] = React.useState("")
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [skip, setSkip] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deleted, setDelete] = React.useState(false);

  const router = useRouter()

  useEffect(() => {
    const fetchAll = () => {
        setLoading(true)
        fetch(
          `${origin}/api/propriete${
            search != "" ? lot != "" ? `?limit=${pageSize}&skip=${skip}&search=${search}&lot=${lot}` : `?limit=${pageSize}&skip=${skip}&search=${search}` : `?limit=${pageSize}&skip=${skip}` 
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
            setProprietes(data);

          })
          .then(() => {
            setLoading(false)
          });
    };

          fetchAll();
          

       //}
      
      
    

  }, [skip, pageSize, search, deleted, lot])

  React.useEffect(() => {
     if(!localStorage.getItem('user')){
      console.log("no user in loc storage :", localStorage.getItem('user'));
      router.push('/login')
    }/* else{
      console.log("user in loc storage :", localStorage.getItem('user'))
      setAuthenticated(true)
    }  */
  }, [])


  const byLot = e => {
    const { value } = e.target
    setLot(value)
  }

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
    fetch(`${origin}/api/propriete?id=${selected.id}`, { method: 'DELETE' })
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
      // remove the profile from local state too
      showSuccessToast();
      setDelete(!deleted)
      setSelected(null) 
    })
    .catch((err) => {
      console.error(err);
    });
  }



  const next = () => {
    setSkip(skip+pageSize)
  }
  const previous = () => {
    setSkip(skip-pageSize)
  }

  const editClick = (row) => {
    router.push({
      pathname: '/add_propriete',
      query: { id: row.id }
    })
  }

  const addPropriete = () => {
    router.push({ pathname: '/add_propriete' })
  }

  const deleteClick = (row) => {
    setSelected(row)
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
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [ day, month, year ].join('-');
  }

  const handleCloseModalDelete = () =>{
    setOpenDelete(false)
  }

  const handleOpenModalDelete = () =>{
    setOpenDelete(true)
  }

  const handleSelectSizeChange = (event) => {
    setSkip(0)
    return setPageSize(event.target.value);
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

  const proprieteDetail = (row) => {
    //setDetail(true);
    return router.push({
      pathname: '/detail',
      query: { id: row.id }
    })
  }

  const getDisbursementsAmount = (disbursements) => {
    var sum = disbursements.reduce((accumulator, e) => {
      return accumulator + e.orderamount
    },0);
    return sum;
  }

  let pounds = Intl.NumberFormat( {
    style: 'currency',
    maximumSignificantDigits: 3,
    minimumFractionDigits: 2
  });
  

  return (<>
    {/* {authenticated &&} */}
    {/* {!detail ? */}
    <BaseCard titleColor={"secondary"} title="Propriétés">

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
        detail = {proprieteDetail}
        field = {shooseField("object")} 
        onSearch = {onSearch}
        byLot = {byLot}
        lot = {lot}
        search = {search}
        openModal = {addPropriete}
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
          {Proprietes.length > 0 ?
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
                rowCount={Proprietes.length}
                headCells={headCells}
                headerBG="#21275f"
                txtColor="#DCDCDC"
              />
              <TableBody>
                {Proprietes
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        //aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        //selected={isItemSelected}
                      >
                        
                        <TableCell></TableCell>
                        <TableCell align="left">{row.zone}</TableCell>
                        <TableCell align="left">{row.lot}</TableCell>
                        <TableCell align="left">{row.lot_Suitt}</TableCell>
                        <TableCell align="left">{row.genre}</TableCell>
                        <TableCell align="left">{formatDate(row.Date_Creaction)} </TableCell>
                        <TableCell align="left">{row.agent}</TableCell>
                        <TableCell align="left">
                            <Tooltip onClick={() => editClick(row)} title="Modifier">
                                <IconButton>
                                    <CreateOutlined fontSize='medium' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip onClick={() => proprieteDetail(row)} title="Detail">
                                <IconButton>
                                    <InfoOutlined color='primary' fontSize='medium' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip onClick={() => deleteClick(row)} title="Supprimer">
                              <IconButton>
                                <Delete color='secondary' fontSize='medium' />
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
            <Box style={{fontSize: '16px'}}>
              Liste vide
            </Box>
          </div>
          }
          </>
        }
      </TableContainer>
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
                <IconButton disabled={Proprietes.length < pageSize} onClick={next} >
                  <ArrowForward/>
                </IconButton>
                </span>
              </Tooltip>
            </div>
       </div>
    </BaseCard>
    {/* :
    <DetailConvention clientsCount = {200 } numbersCount = {200 } convention = {selected} />
    } */}
  </>);
}


export async function getServerSideProps(context) {
    const { req } = context;
  
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const origin = req ? `${protocol}://${req.headers.host}` : '';
      
    return {
      props: { origin },
    };
  }
  