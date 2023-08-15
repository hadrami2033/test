import * as React from 'react';
import DetailConvention from "../src/components/DetailConvention";
import { useRouter } from 'next/router';

export default function ConventionDetailPage(){
    const router = useRouter()
    const { id } = router.query

    return( <DetailConvention id = {id} />)
}