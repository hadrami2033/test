import * as React from 'react';
import Detail from "../src/components/Detail";
import { useRouter } from 'next/router';

export default function DetailPage({origin}){
    const router = useRouter()
    const { id } = router.query

    return( <Detail id = {id} origin = {origin} />)
}

export async function getServerSideProps(context) {
    const { req } = context;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const origin = req ? `${protocol}://${req.headers.host}` : '';
    return {
      props: { origin },
    };
}