import { connectToDatabase } from '../../utils/couchbase';
import { v4 } from 'uuid';

async function handler(req, res) {
  const {cluster, collection} = await connectToDatabase();
  // Parse the body only if it is present
  let body = !!req.body ? JSON.parse(req.body) : null;

  if (req.method === 'POST') {
    const id = v4();
    const local = {
      id: id,
      ...body,
    };
    await collection.insert(local.id, local)
        .then((result) => {
          res.status(201).send({...local, ...result});
        })
        .catch((error) => {
          if (error.message === 'authentication failure') {
            return res.status(401).send({
              "message": error.message,
            });
          }

          res.status(500).send({
            "message": `local Insert Failed: ${error.message}`
          });
        });
  } else if (req.method === 'PUT') {
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
          PROPRIETE: req.query.propriete ? req.query.propriete : null,
          ID: req.query.id ? req.query.id : null,
          SEARCH: req.query.search ? req.query.search : null
        }
      };
      const query = options.parameters.PROPRIETE == null ? 
        options.parameters.ID == null ? 
            options.parameters.SEARCH == null ? `
                SELECT p.*, meta().id as id
                FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id not like '%_sync%'
                AND p.type='local'
                LIMIT $LIMIT OFFSET $SKIP;
                `:`
                SELECT p.*, meta().id as id
                FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id not like '%_sync%'
                AND p.type='local' AND p.occupee='Oui' AND p.occupation_type = $SEARCH
                LIMIT $LIMIT OFFSET $SKIP;
            `:  `
            SELECT p.*, meta().id as id
            FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id=$ID;
        ` : `
        SELECT p.*, meta().id as id
        FROM \`${process.env.CB_BUCKET}\`._default._default p
        WHERE meta().id not like '%_sync%' AND p.type='local'
        AND p.propriete=$PROPRIETE
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

