import * as React from 'react';
import DetailCommitment from "../src/components/DetailCommitment";
import { useRouter } from 'next/router';
import apiService from '../src/services/apiService';

export default function CommitementDetailPage(){
    const [commitment, setCommitment] = React.useState({});
    const router = useRouter()
    const { id, contractorId} = router.query

    React.useEffect(() => {
        apiService.getCommitment(id).then(res => {
          setCommitment(res.data)
          console.log(res.data); 
        } )
    }, [])

    return(<DetailCommitment 
                commitment = {commitment} 
                contractorId = {contractorId}                 
            />)
}