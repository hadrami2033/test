import * as couchbase from 'couchbase';
/* import { Collection } from 'couchbase';

const tst : Collection

tst. */

const CB_USERNAME = process.env.CB_USERNAME;
const CB_PASSWORD = process.env.CB_PASSWORD;
const CB_CONNECT_STRING = process.env.CB_CONNECT_STRING;
const CB_BUCKET = process.env.CB_BUCKET;

if (!CB_USERNAME) {
  throw new Error(
    'Please define the CB_USERNAME environment variable. \nIf you are seeing this error after creating a new trial database, please see the instructions in the README for re-deploying your application.'
  );
}

if (!CB_PASSWORD) {
  throw new Error('Please define the CB_PASSWORD environment variable');
}

if (!CB_CONNECT_STRING) {
  throw new Error('Please define the CB_CONNECT_STRING environment variable');
}

if (!CB_BUCKET) {
  throw new Error('Please define the CB_BUCKET environment variable inside');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.couchbase;

if (!cached) {
  cached = global.couchbase = { conn: null };
}

async function createCouchbaseCluster() {
  if (cached.conn) {
    //console.log("cached.conn   : ", cached.conn);
    return cached.conn;
  }

  try {
    let connectionString = CB_CONNECT_STRING+'?network=external&timeout=20.0';

    // temporary fix to ensure testability across all environments
    /* if (CB_CONNECT_STRING.startsWith('couchbases')) {
      connectionString = connectionString + '?tls_verify=none';
    } */

    //console.log("connnection STR :  ", connectionString); ?network=external&tls_verify=none
    cached.conn = await couchbase.connect(connectionString, {
      username: CB_USERNAME,
      password: CB_PASSWORD,
      /* dnsConfig:{
        nameserver:"10.11.0.1",
        port:8091,
        dnsSrvTimeout:20000,
      } */
    });
  } catch (e) {
    throw new Error(
      e + ' Error Connecting to Couchbase Database. Ensure the correct IPs are allowed and double check your database user credentials.'
    );
  }

  return cached.conn;
}

export async function connectToDatabase() {
  const cluster = await createCouchbaseCluster();
  const bucket = cluster.bucket(CB_BUCKET);
  const collection = bucket.defaultCollection();
  //const profileCollection = bucket.collection('_default');

  let dbConnection = {
    cluster,
    bucket,
    collection,
    //profileCollection,
  };

  return dbConnection;
}
