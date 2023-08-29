import * as React from 'react';
import DetailInvoice from "../src/components/DetailInvoice";
import { useRouter } from 'next/router';
import apiService from '../src/services/apiService';

export default function CommitementDetailPage(){
    const router = useRouter()
    const {id} = router.query

    return(<DetailInvoice id = {id}/>)
}