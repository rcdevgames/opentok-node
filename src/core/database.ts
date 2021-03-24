import { Client, Pool } from "pg";
import config from "./config";
  
const connectionString = "postgresql://"+ config.POSTGRESQL_USERNAME +":"+ config.POSTGRESQL_PASSWORD +"@"+ config.POSTGRESQL_HOST +":"+ config.POSTGRESQL_PORT +"/"+ config.POSTGRESQL_DATABASE;

export const pool = new Pool({ connectionString });

export const connectionCreate = new Promise(async (resolve, rejects) => {
    console.log(connectionString);
    const client = new Client({ connectionString });

    try {
        await client.connect();
        console.log('Database connection check: Successful');
        await client.end();
        console.log('Database connection check: Ended');
        resolve(true);
    } catch (err) {
        rejects('Database connection check: ' + err);
    }
})