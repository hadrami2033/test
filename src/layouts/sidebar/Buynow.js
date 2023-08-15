import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import apiService from "../../services/apiService";
import Controls from "../../components/controls/Controls";
import { useRouter } from "next/router";

const Buynow = () => {

  const [yearId, setYearId] = React.useState(null);
  const [years, setYears] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [currentYear, setCurrentYear] = React.useState("");
  const router = useRouter()

  React.useEffect(() => {

  }, [])

  const handleClose = () =>{
    setOpen(false)
  }

  const handlOpen = () =>{
    setOpen(true)
  }

  const goTrash = () =>{
    router.push('/trash')
  }

  const saveYear = () =>{
    setOpen(false)
    apiService.updateCurrentYear(yearId).then(
      res => {
        console.log(res)
        router.reload()
      },
      error => console.log(error)
    )
  }

  const getYear = e =>{
    setYearId(e.target.value)
  }

 return( 
  <Box pb={5} mt={5}>
    <Box
      pl={3}
      pr={3}
      m={1}
      textAlign="center"
      bottom={2}
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.light,
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Box pb={3} pt={3}>

      <Dialog 
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move', display:"flex" ,justifyContent:"end", fontSize:"24px",fontWeight:"bold", paddingInline:"20px" }} id="draggable-dialog-title">
             تغيير السنة الحالية
        </DialogTitle>
        <DialogContent style={{width:500,display:"flex" ,justifyContent:"center", fontSize:'25px' }}>
          <DialogContentText>
            <br></br>
            <Box  style={{width:'100%' ,display:'flex', justifyContent:'center'}}>
              <Controls.Select
                name="yearId"
                label="السنة"
                value={yearId}
                onChange={getYear}
                options={years}
              />
            </Box>
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            style={{fontSize:"24px",fontWeight:"bold"}}
          >
            إلغاء
          </Button>

          <Button
            disabled={yearId === null}
            //onClick={saveYear}
            style={{fontSize:"24px",fontWeight:"bold"}}
          >
            Configurer
                    </Button>
        </DialogActions>
        </Dialog>

        <Typography variant="h4" fontWeight="700" mb={2}>
          {currentYear}
        </Typography>
        <Button
         // onClick={handlOpen} 
          variant="contained"
          color="primary"
          fullWidth
          target="_blank"
          title="تغيير السنة"
          sx={{ 
            fontSize: "h5.fontSize",
            fontWeight: "700",
            marginBottom: "10px" 
          }}
        >
          Configurer
        </Button>

      </Box>
    </Box>
  </Box>
  ) 
}
;
export default Buynow;