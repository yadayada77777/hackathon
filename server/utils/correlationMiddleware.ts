/* eslint-disable @typescript-eslint/no-var-requires */
let session = require('continuation-local-storage').createNamespace('session');
import { uuid } from 'uuidv4';
export const correlationKey = 'x-correlation-id';

// This middleware is used for saving data per request, afterward eacgh in code we can use session for getting the data and don't need the header
export function middleware(req: any, res: any, next: any) {
    session = require('continuation-local-storage').getNamespace('session');
    session.bindEmitter(req);
    session.bindEmitter(res);

    session.run((() => {
        let correlationId = null;

        if (req.headers[correlationKey]) {
            correlationId = req.headers[correlationKey];
            console.debug("---- USING A KEY ----" + correlationId);
        } else {
            correlationId = uuid();
            console.debug("---- SETTING A KEY ----" + correlationId);
        }

        session.set(correlationKey, correlationId);

        next();
    }));
}

export function getCorrlationId() {
    const key = session.get(correlationKey);
    return key;
}

export function runInSession(handler: () => any) {
    session.run(() => {
        session.set(correlationKey, uuid());
        handler();
    });
}
