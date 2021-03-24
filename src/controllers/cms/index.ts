import { FastifyInstance } from "fastify";
import { request } from "http";

export default (app: FastifyInstance, opt, next) => {
    app.route({
        method: "GET",
        url: "/",
        handler: async (req, res) => {
            res.view('/src/views/templates/index', { text: 'text' });
        }
    });
    next();
}