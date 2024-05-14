import * as React from 'react';
import Local from "../src/components/Local";
import { useRouter } from 'next/router';

export default function LocalPage({origin}){
    const router = useRouter()
    const { id, c } = router.query

    return( <Local id = {id} c = {c} origin = {origin} />)
}

export async function getServerSideProps(context) {
    const { req } = context;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const origin = req ? `${protocol}://${req.headers.host}` : '';
    return {
      props: { origin },
    };
}