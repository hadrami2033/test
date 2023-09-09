import * as React from 'react';
import DetailCommitment from "../src/components/DetailCommitment";
import { useRouter } from 'next/router';

export default function CommitementDetailPage(){
    const router = useRouter()
    const {id} = router.query

    return(<DetailCommitment id = {id} />)
}