import express = require('express');
import { Request } from 'express';
import { Response } from 'express';
import AppConfig from '../config';

const router = express.Router();

import proxy from '../utils/proxy';

// get all freeDraws from freeDraws service
router.get(
    '/freeDrawsGet',
    async (request: Request, response: Response): Promise<void> => {
        const fdUrl = AppConfig.freeDrawsGetHttpUrl;
        console.info('freeDrawsGet - requested transfer to: ', fdUrl);
        const options = {
            url: fdUrl,
            method: 'GET',
            // body: req.body,
            // headers: req.headers
        };
        proxy.get(options)
            .then((data: any) => {
                console.info('freeDrawsGet - response received from freeDraws service:', data);
                response
                    .type('application/json')
                    .send(data);
            })
            .catch(( (err: any) => {
                console.error('freeDrawsGet - Error in getting data from: ' + fdUrl + ', err=' + err.message);
                response
                    .status(err.statusCode)
                    .type('application/json')
                    .send({ error: 'freeDrawsGet - Error in getting data from: ' + fdUrl + ', err=' + err.message });
            }));
    }
);

// update single freeDraw
router.post(
    '/freeDrawUpdate',
    async (request: Request, response: Response): Promise<void> => {
        const fDrawUrl = AppConfig.freeDrawsUpdateHttpUrl;
        console.info('freeDrawUpdate - requested with parameter', request.body, ' transfer to: ', fDrawUrl);
        const options = {
            url: fDrawUrl,
            method: 'POST',
            data: request.body,
            // headers: req.headers
        };
        proxy.post(options)
            .then((res: any) => {
                console.info('freeDrawUpdate - response received from freeDraws service:', res);
                response
                    .type('application/json')
                    .send(res);
            })
            .catch(((err: any) => {
                console.error('freeDrawUpdate - Error in getting data from: ' + fDrawUrl + ', err=' + err.message);
                response
                    .status(err.statusCode)
                    .type('application/json')
                    .send({ error: 'freeDrawUpdate - Error in getting data from: ' + fDrawUrl + ', err=' + err.message });
            }));
    }
);

// update single freeDraw
router.post(
    '/freeDrawDelete',
    async (request: Request, response: Response): Promise<void> => {
        const fDrawUrl = AppConfig.freeDrawsDeleteHttpUrl;
        console.info('freeDrawDelete - requested with parameter', request.body, ' transfer to: ', fDrawUrl);
        const options = {
            url: fDrawUrl,
            method: 'POST',
            data: request.body,
        };
        proxy.post(options)
            .then((result: any) => {
                console.info('freeDrawDelete - response received from freeDraws service:', result);
                response
                    .type('application/json')
                    .send(result);
            })
            .catch(((error: any) => {
                console.error('freeDrawDelete - Error in deleting data from: ' + fDrawUrl + ', err=' + error.message);
                response
                    .status(error.statusCode)
                    .type('application/json')
                    .send({ error: 'freeDrawDelete - Error in getting data from: ' + fDrawUrl + ', err=' + error.message });
            }));
    }
);
export default router;
