import axios from 'axios';
import correlationMiddleware = require('./correlationMiddleware');

function setHeader(o: any) {
    const key = correlationMiddleware.getCorrlationId();
    if (!o.headers) { o.headers = {}; }
    o.headers[correlationMiddleware.correlationKey] = key;
}

const printRequest = (o: any) => {
    console.debug('httpProxy: Request made the correlationid is: ' + o.headers[correlationMiddleware.correlationKey]);
    console.debug('httpProxy: the method is: ' + o.method);
    console.debug('httpProxy: the url is: ' + o.url);
    if (o.data !== undefined) {
        console.debug('httpProxy: the body is: ' + JSON.stringify(o.data));
    }
};

const request = (o: any) => {
    setHeader(o);
    printRequest(o);
    return axios.request(o).then(res => res.data).catch(err => {
        err.statusCode= err.response?.status || 500;
        throw err;
    });
};

const proxy = {

    get: (o: any) => {
        return request(o);
    },

    put: (o: any) => {
        return request(o);
    },

    post: (o: any) => {
        return request(o);
    },

    delete: (o: any) => {
        return request(o);
    }
};

export default proxy;
