import * as React from 'react';
import DetailCommitment from "../src/components/DetailCommitment";
import { useRouter } from 'next/router';
import useAxios from '../src/utils/useAxios';
import AuthContext from '../src/context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function CommitementDetailPage(){
    const router = useRouter()
    const {id, convention} = router.query
    const axios = useAxios();
    const { logoutUser } = React.useContext(AuthContext);

    const [Convention, setConvention] = React.useState(null);
    const [loading, setLoading] = React.useState(false);


    React.useEffect(() => {
        if(convention){ 
            setLoading(true)
            axios.get(`/conventions/${convention}`).then(res => {
                setConvention(res.data)
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
          }
    }, [])

    return( 
        <>
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
        <DetailCommitment id = {id} convention = {Convention} />
        }
    </> 
    
    )
}