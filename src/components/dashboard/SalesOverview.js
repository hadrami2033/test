import React from "react";
import { Card, Button, Typography, Snackbar, Alert, CircularProgress, Box } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
import apiService from "../../services/apiService";
import BlogCard from "./BlogCard";
import * as XLSX from 'xlsx/xlsx.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { useRouter } from "next/router";
import Controls from "../controls/Controls";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverview = () => {
  const [loading, setLoading] = React.useState(false);
  const [all, setAll] = React.useState(0);
  const [numbersAccount, setNumbersAccount] = React.useState(0);
  const [paidsStatistics, setPaidsStatistics] = React.useState([[], []]);
  const [loadingFile, setLoadingFile] = React.useState(false);
  const [importedFile, setImportedFile] = React.useState(false);
  const [file, setFile] = React.useState({});
  const [fileName, setFileName] = React.useState(null);
  const [fileToImport, setFileToImport] = React.useState([]);
  const [openFailedFileToast, setOpenFailedFileToast] = React.useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [fournisseurId, setFournisseurId] = React.useState(null);
  const [fournisseurs, setFournisseurs] = React.useState([]);

  const router = useRouter()

  React.useEffect(() => {
   /*  setLoading(true)
    apiService.getPaidsStatistics().then(
      res => {
        console.log("paids statistics : ", res.data);
        setPaidsStatistics(res.data)
      },  
      error => console.log(error)
    ).then(() => {
      apiService.getCurrentMonth().then(
        cMonth => {
          console.log("current month : ", cMonth.data);
          apiService.getClients(1, 0, "", cMonth.data.monthId).then(
            res => {
              setAll(res.data.TotalCount);
            },  
            error => console.log(error)
          )
        },
        error => { console.log(error); }
      )
    })    
    .then(() => setLoading(false)) */
  }, [])


  const optionssalesoverview = {
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        endingShape: "rounded",
        borderRadius: 2,
      },
    },

    colors: ["#fb9678", "#03c9d7"],
    fill: {
      type: "solid",
      opacity: 1,
    },
    chart: {
      offsetX: -15,
      toolbar: {
        show: false,
      },
      foreColor: "#adb0bb",
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "ديسمبر",
        "نوفمبر",
        "أكتوبر",
        "سبتمبر",
        "أغسطس",
        "يوليو",
        "يونيو",
        "مايو",
        "أبريل",
        "مارس",
        "فبراير",
        "يناير",
      ],
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    yaxis: {
      show: true,
      min: 0,
      max: all,
      tickAmount: 5,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
    },
  };
  const seriessalesoverview = [
    {
      name: " لم يدفعوا  ",
      data: paidsStatistics[1],
    },
    {
      name: " دفعوا  ",
      data: paidsStatistics[0],
    },
  ];

  const handleCloseModalDelete = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenDelete(false)
    }
  }

  const closeModalSelect = (event, reason) => {
    if (reason === "backdropClick") {
      console.log(reason);
    } else {
      setOpenSelect(false)
    }
  }

  const openModalSelect = () =>{
    setOpenSelect(true)
  }

  const handleOpenModalDelete = () =>{
    setOpenDelete(true)
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

  const selectFile = (e) => {
    const files = e.target.files;
    setLoadingFile(true)

    if (files && files[0]){
      setFile(files[0]);
      console.log(files[0].name);
      setFileName(files[0].name);
      setLoadingFile(false) 
    }
    //handleFile();
  };

  const handleFile = () => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
 
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      /* this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
        console.log(JSON.stringify(this.state.data, null, 2));
      }); */

      //setCols(make_cols(ws['!ref']))

      /* var mapRes = data.map(e => {
        return {...e, solde:0};
      }) */


      if(data[0].phone) {
        setFileToImport(data);
        handleOpenModalDelete()
      }else{
        console.log("incompatible file ");
        showFailedFileToast();
        setFileName(null);
      }
    };
 
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    };
  }

  const showFailedFileToast = () => {
    setOpenFailedFileToast(true);
  };

  const closeFailedFileToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenFailedFileToast(false);
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

  const remove = () =>{
    console.log("file to import is => ", fileToImport);
    setLoadingFile(true);
    apiService.deleteNumbers(fileToImport).then(
      res => {
        console.log(res);
        setFileToImport([]);
        setFileName(null);
        showSuccessToast()
        setLoadingFile(false);
      },
      error => {
        console.log(error)
        setLoadingFile(false);
        showFailedToast()
      }
    ).then(() =>{
      setLoadingFile(false);
      setFileToImport([]);
      setFileName(null);
      setFile({})
      handleCloseModalDelete()
      setImportedFile(!importedFile)
      router.reload();
    })
    

  }

  const cancelDelete = () => {
    setLoadingFile(false);
    setFileToImport([]);
    setFileName(null);
    setFile({})
    handleCloseModalDelete()
    setImportedFile(!importedFile) 
  }

  const getFournisseur = e =>{
    setFournisseurId(e.target.value)
  }

  const goToVerify = () =>{
    router.push({
      pathname: '/correspondences',
      query: { id: fournisseurId , name: fournisseurs.filter(e => e.id === parseInt(fournisseurId))[0].name}
    })
  }

  return (
    <>
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openSuccessToast} autoHideDuration={6000} onClose={closeSuccessToast}>
        <Alert onClose={closeSuccessToast} severity="success" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
          تمت العملية بنجاح 
        </Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openFailedToast} autoHideDuration={6000} onClose={closeFailedToast}>
        <Alert onClose={closeFailedToast} severity="error" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
          واجهتك مشكلة ،العملية لم تتم
        </Alert>
      </Snackbar>

      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={openFailedFileToast} autoHideDuration={6000} onClose={closeFailedFileToast}>
        <Alert onClose={closeFailedFileToast} severity="error" sx={{ width: '100%' }} style={{fontSize:"24px",fontWeight:"bold"}}>
          الملف المختار غير متطابق
        </Alert>
      </Snackbar>

      <Dialog 
        open={openDelete}
        onClose={handleCloseModalDelete}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move', display:"flex" ,justifyContent:"end", fontSize:"24px",fontWeight:"bold", paddingInline:"20px" }} id="draggable-dialog-title">
          عملية حذف
        </DialogTitle>
        <DialogContent style={{width:300,display:"flex" ,justifyContent:"center", padding:"25px" }}>
          <DialogContentText>
            الرجاء تأكيد العملية
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={cancelDelete}
            style={{fontSize:"24px",fontWeight:"bold"}}
            disabled={loadingFile}
          >
          إلغاء
          </Button>
          <Button onClick={remove} 
          disabled={loadingFile}
          style={{fontSize:"24px",fontWeight:"bold"}}
          >تأكيد
          {loadingFile && (
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
        </DialogActions>
      </Dialog>

      <Dialog 
        open={openSelect}
        onClose={closeModalSelect}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move', display:"flex" ,justifyContent:"end", fontSize:"24px",fontWeight:"bold", paddingInline:"20px" }} id="draggable-dialog-title">
          إجراء مطابقة
        </DialogTitle>
        <DialogContent style={{width:500,display:"flex" ,justifyContent:"center", fontSize:'25px' }}>
          <DialogContentText>
            <Box style={{fontSize:"20px"}}>
              اختر مورد للتحقق من مطابقة أرقامه مع ملف أكسل
            </Box> 
            <br></br>
            <Box  style={{width:'100%' ,display:'flex', justifyContent:'center'}}>
              <Controls.Select
                name="fournisseurId"
                label="المورد"
                value={fournisseurId}
                onChange={getFournisseur}
                options={fournisseurs}
              />
            </Box>
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={closeModalSelect}
            style={{fontSize:"24px",fontWeight:"bold"}}
          >
            إلغاء
          </Button>

          <Button
            disabled={fournisseurId === null}
            onClick={goToVerify}
            style={{fontSize:"24px",fontWeight:"bold"}}
          >
            متابعة
          </Button>
        </DialogActions>
      </Dialog>

    {loading ? (
      <div 
          style={{
            width:'100%', 
            marginTop:'25%',
            display:'flex',
            justifyContent:'center'
          }} 
        >
      <CircularProgress
          size={60}
          sx={{
            color: 'primary',
          }}
      />
    </div>

      ) : (<>
    <BaseCard titleColor={"secondary"} title="Statistiques des conventions">
    {all > 0 ?
      <Chart
        options={optionssalesoverview}
        series={seriessalesoverview}
        type="bar"
        height="295px"
      />
      :
      <div style={{width:'100%', fontSize:'20px', display:'flex', justifyContent:'center'}}>
        Pas de statistique pour le momment
      </div>
     } 
    </BaseCard>
    </>
    )
  }
  </>
  );
};

export default SalesOverview;
