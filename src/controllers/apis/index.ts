import { FastifyInstance } from "fastify"
import { routeGet, routePost } from "../../helpers/routes";
import { getLeadsRoom } from "./leads";
import { getUser } from './users';

export default (app: FastifyInstance, opt, next) => {
    // app.post('/user', opt, getUser);
    routePost(app, "/", getUser);
    routePost(app, "/room", getLeadsRoom);

    next();
}