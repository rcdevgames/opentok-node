import { FastifyInstance, RouteHandlerMethod } from "fastify";
import { withAuthorize, withoutAuthorize } from './verifyHeaders';

const routeGet = (app: FastifyInstance, path: string, handler: RouteHandlerMethod, auth: boolean = false) => {
    return app.route({
        url: path,
        method: "GET",
        handler,
        onRequest: auth ? withAuthorize : withoutAuthorize
    });
}
const routePost = (app: FastifyInstance, path: string, handler: RouteHandlerMethod, auth: boolean = false) => {
    return app.route({
        url: path,
        method: "POST",
        handler,
        onRequest: auth ? withAuthorize : withoutAuthorize
    });
}
const routePut = (app: FastifyInstance, path: string, handler: RouteHandlerMethod, auth: boolean = false) => {
    return app.route({
        url: path,
        method: "PUT",
        handler,
        onRequest: auth ? withAuthorize : withoutAuthorize
    });
}
const routeDelete = (app: FastifyInstance, path: string, handler: RouteHandlerMethod, auth: boolean = false) => {
    return app.route({
        url: path,
        method: "DELETE",
        handler,
        onRequest: auth ? withAuthorize : withoutAuthorize
    });
}

export {
    routeGet,
    routePost,
    routePut,
    routeDelete
}
