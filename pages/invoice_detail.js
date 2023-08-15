import * as React from 'react';
import DetailInvoice from "../src/components/DetailInvoice";
import { useRouter } from 'next/router';
import apiService from '../src/services/apiService';

export default function CommitementDetailPage(){
    const [Invoice, setInvoice] = React.useState({});
    const router = useRouter()
    const { id, commitmentId} = router.query

    React.useEffect(() => {
        apiService.getInvoice(id).then(res => {
          setInvoice(res.data)
          console.log(res.data); 
        } )
    }, [])

    return(<DetailInvoice 
                Invoice = {Invoice} 
                CommitmentId = {commitmentId}                 
            />)
}