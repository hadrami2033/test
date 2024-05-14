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
    if (!body.email) {
      return res.status(400).send({
        "message": 'email is required'
      });
    }

    const id = v4();
    const proprietaire = {
      pid: id,
      ...body,
    };
    await collection.insert(proprietaire.pid, proprietaire)
        .then((result) => {
          res.status(201).send({...proprietaire, ...result});
        })
        .catch((error) => {
          if (error.message === 'authentication failure') {
            return res.status(401).send({
              "message": error.message,
            });
          }

          res.status(500).send({
            "message": `proprietaire Insert Failed: ${error.message}`
          });
        });
  } else if (req.method === 'PUT') {
    /**
     *  PUT HANDLER
     */
    try {
      await collection.get(req.query.id)
          .then(async (result) => {

            /* Persist updates with new doc */
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
          })
          .catch((e) => res.status(500).send({
            "message": `proprietaire Not Found, cannot update: ${e.message}`
          }));
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
          SEARCH: req.query.search ? req.query.search : null,
          ID: req.query.id ? req.query.id : null
        }
      };
      const query = options.parameters.PROPRIETE != null ? `
            SELECT p.*, meta().id as id
            FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id not like '%_sync%'
            AND p.type='proprietaire' AND p.propriete = $PROPRIETE
            LIMIT $LIMIT OFFSET $SKIP;
        ` : 
        options.parameters.ID == null ? 
            options.parameters.SEARCH == null ? `
              SELECT p.*, meta().id as id
              FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id not like '%_sync%'
              AND p.type='proprietaire' 
              LIMIT $LIMIT OFFSET $SKIP;
              `: 
               `SELECT p.*, meta().id as id
                FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id not like '%_sync%' 
                AND p.type='proprietaire' AND p.telephone = $SEARCH
                LIMIT $LIMIT OFFSET $SKIP;`
              : `
            SELECT p.*, meta().id as id
            FROM \`${process.env.CB_BUCKET}\`._default._default p where meta().id=$ID;
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
              "message": `proprietaire Not Found, cannot delete: ${error.message}`
            });
          });
    } catch (e) {
      console.error(e);
    }
  }

}

export default handler;

