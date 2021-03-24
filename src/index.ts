import * as dotenv from "dotenv";
dotenv.config({ path: '.env' });

import createServer from './core/server';
import config from './core/config';

createServer(false, true)
.then(async app => {
    process.on('unhandledRejection', (err) => {
        console.error(err);
        process.exit(1);
    });

    const PORT: number = Number(config.PORT) || 4000;
    await app.listen(PORT);
    console.log(`List Routes: \n${app.printRoutes()}`);

    if (process.env.NODE_ENV === 'production') {
        for (const signal of ['SIGINT', 'SIGTERM']) {
          process.on(signal, () =>
            app.close().then((err) => {
              console.log(`close application on ${signal}`);
              process.exit(err ? 1 : 0);
            }),
          );
        }
    }
});