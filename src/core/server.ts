import fastify, { FastifyInstance } from 'fastify';
import fastifyHelmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import fastifyRateLimit from 'fastify-rate-limit';
import fastifyStatic from 'fastify-static';
import fastifyCors from 'fastify-cors';
import fastifyRedis from 'fastify-redis';
import pointOfView from 'point-of-view';
import * as routes from '../controllers';
import path = require('path');
import handlebars = require('handlebars');
import { connectionCreate } from './database';

const server: FastifyInstance = fastify({ logger: true });
const createServer = async (useRedis: boolean, useAdminPage: boolean) => {
    server.register(fastifyHelmet, {})
    server.register(fastifyMultipart, {})
    server.register(fastifyRateLimit, {})
    server.register(fastifyCors, {})
    server.register(routes.api, { prefix: 'api/v1' });
    server.register(routes.cms, { prefix: 'cms' });

    if (useRedis) server.register(fastifyRedis, { host: '127.0.0.1' });
 
    if (useAdminPage) {
        server.register(pointOfView, {
            engine: {
                handlebars: handlebars
            },
            includeViewExtension: true,
            layout: '/src/views/layout/main'
            // options: {
            //     partials: {
            //         header: '/views/partials/header.hbs',
            //         footer: '/views/partials/footer.hbs'
            //     }
            // }
        })
        server.register(fastifyStatic, {
            root: path.join(__dirname, '../../public'),
            prefix: '/', // optional: default '/'
        })
    }

    await connectionCreate;
    await server.ready();
    return server;
}

export default createServer;