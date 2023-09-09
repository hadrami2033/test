import * as React from 'react';
import DetailInvoice from "../src/components/DetailInvoice";
import { useRouter } from 'next/router';

export default function CommitementDetailPage(){
    const router = useRouter()
    const {id} = router.query

    return(<DetailInvoice id = {id}/>)
}