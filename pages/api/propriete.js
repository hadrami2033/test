import { connectToDatabase } from '../../utils/couchbase';
import { v4 } from 'uuid';

async function handler(req, res) {
  const {cluster, collection} = await connectToDatabase();
  // Parse the body only if it is present
  let body = !!req.body ? JSON.parse(req.body) : null;

  if (req.method === 'POST') {
    /**
     *  POST HANDLER
     */

    const id = v4();
    const propriete = {
      id: id,
      ...body,
    };
    await collection.insert(propriete.id, propriete)
        .then((result) => {
          res.status(201).send({...propriete, ...result});
        })
        .catch((error) => {
          if (error.message === 'authentication failure') {
            return res.status(401).send({
              "message": error.message,
            });
          }

          res.status(500).send({
            "message": `propriete Insert Failed: ${error.message}`
          });
        });
  } else if (req.method === 'PUT') {
    /**
     *  PUT HANDLER
     */
    try {
        /* Persist updates with new doc */
        //console.log("body :  ", body);
        await collection.upsert(req.query.id, body)
            .then((result) => res.send({ ...body, ...result }))
            .catch((error) => {
                if (error.message === 'authentication failure') {
                  return res.status(401).send({
                    "message": error.message,
                  });
                }
                res.status(500).send(error);
            });
    } catch (e) {
      console.error(e);
    }
  } else if (req.method === 'GET') {
    /**
     *  GET HANDLER
     */
    try {
      const options = {
        parameters: {
          SKIP: Number(req.query.skip || 0),
          LIMIT: Number(req.query.limit || 25),
          SEARCH: req.query.search ? req.query.search : null,
          LOT: req.query.lot ? req.query.lot : null,
          ID: req.query.id ? req.query.id : null
        }
      };
      const query = options.parameters.SEARCH == null ?
            options.parameters.ID == null ? `
            SELECT p.*, meta().id as id
            FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id not like '%_sync%'
            AND p.type='propriete'
            LIMIT $LIMIT OFFSET $SKIP;
            `:  `
            SELECT p.*, meta().id as id
            FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id=$ID;
            ` :  
        options.parameters.LOT == null ? `
        SELECT p.*, meta().id as id
        FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id not like '%_sync%'
        AND p.type='propriete' AND p.zone = $SEARCH  
        LIMIT $LIMIT OFFSET $SKIP;
        ` : `
        SELECT p.*, meta().id as id
        FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id not like '%_sync%'
        AND p.type='propriete' AND p.zone = $SEARCH AND p.lot = $LOT
        LIMIT $LIMIT OFFSET $SKIP;
        `;
      await cluster.query(query, options)
          .then((result) => res.send(result.rows))
          .catch((error) => res.status(500).send({
            "message": `Query failed: ${error.message}`
          }));
    } catch (e) {
      console.error(e);
    }
  } else if (req.method === 'DELETE') {
    /**
     *  DELETE HANDLER
     */
    try {
      await collection.remove(req.query.id)
          .then(() => {
            res.status(200).send({message: "Successfully Deleted: " + req.query.id});
          })
          .catch((error) => {
            if (error.message === 'authentication failure') {
              return res.status(401).send({
                "message": error.message,
              });
            }

            res.status(500).send({
              "message": `propriete Not Found, cannot delete: ${error.message}`
            });
          });
    } catch (e) {
      console.error(e);
    }
  }

}

export default handler;

