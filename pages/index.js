import React  from 'react';
import { Grid } from "@mui/material";
import Dashboard from "../src/components/dashboard/Dashboard";

export default function Index({origin}) {

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12}>
        <Dashboard origin={origin} />
      </Grid>
    </Grid>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const origin = req ? `${protocol}://${req.headers.host}` : '';

  //await connectToDatabase();

  //const { collection } = connection;

  // Check connection with a KV GET operation for a key that doesnt exist
  //let isConnected = true;
/*   try {
    await collection.get('testingConnectionKey');
    // documentsQuery = `SELECT * FROM \`${CB_BUCKET}\``;
    //const documentsQuery = `SELECT * FROM \`${CB_BUCKET}\` where meta().id not like '%_sync%' limit 5`;
    //const documentsQuery = `SELECT count(*) FROM \`${CB_BUCKET}\` where meta().id not like '%_sync%'`;

    //const documents = await cluster.query(documentsQuery);
    //console.log("all documents : ", documents.rows[0].$1);
    //documents.rows.map(e => {
    //  console.log(e[CB_BUCKET].adresse); 
    //}); 
 
    //await collection.map(e => console.log(e));
  } catch (err) {
    // error message will return 'document not found' if and only if we are connected
    // (but this document is not present, we're only trying to test the connection here)
    //console.log("connnne err : ", err.message);
    if (err.message === 'document not found') {
      isConnected = true;
    }
    // if the error message is anything OTHER THAN 'document not found', the connection is broken
  } */

  return {
    props: { origin },
  };
}
