// import Opentok from 'opentok';
var Opentok = require('opentok');
import config from '../core/config';

const opentokSdk = Opentok(config.OPENTOK_KEY, config.OPENTOK_SECRET);

const createSession = () => {
    return new Promise((resolve, reject) => {
        opentokSdk.createSession(function(err, session) {
            if (err) reject(err);
            console.log(session);
            resolve(session.sessionId);
            // save the sessionId
            // db.save('session', session.sessionId, done);
        });
    });
}

export {
    createSession
}