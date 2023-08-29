import * as React from 'react';
import { useRouter } from 'next/router';
import ConventionForm from '../src/components/AddConvention';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import BaseCard from '../src/components/baseCard/BaseCard';
import apiService from '../src/services/apiService';
import { useEffect } from 'react';

export default function AddConvention(){
  const router = useRouter()
  const { id } = router.query

  const [convention, setConvention] = React.useState(null);
  const [openFailedToast, setOpenFailedToast] = React.useState(false);
  const [openSuccessToast, setOpenSuccessToast] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if(id){
      setLoading(true)
      apiService.getConvention(id).then(res => {
          setConvention(res.data)
          setLoading(false)
      })
    }
  }, [])


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


  return( 
    <>
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

       

      {loading ?
        <BaseCard>
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
        </BaseCard>
      :
        <ConventionForm
                convention={convention} 
                showSuccessToast={showSuccessToast}
                showFailedToast={showFailedToast}
        />
      }

      

    </>
    )
}