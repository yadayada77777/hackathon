import express = require('express');
import { Request } from 'express';
import { Response } from 'express';
import AppConfig from '../config';
import * as searchELOsInPolygon from '../services/elasticQueries/ELOInsidePolygon.json';

const router = express.Router();

import proxy from '../utils/Proxy';

const neoUrl = 'http://localhost:7474/db/data/transaction';

// const elasticELOsIndexes = ['buildings', 'launch', 'explorium'];
const elasticELOsIndexes = ['buildings'];

router.post(
    '/db/data/transaction/:buildingId',
    async (request: Request, response: Response): Promise<void> => {     
       
        console.info('get relations for building ' + request.params.buildingId);
        //body        
        const body = {
            'statements': [{
                'statement': "MATCH (n:building {id:'" + request.params.buildingId + "'})-[r:connected]->(b:building) return n,b,r",
                'parameters': {
                    'props': {
                        'name': 'My Node'
                    }
                }
            }]
        };
                             
        request.headers['content-type'] = 'application/json';
        request.headers.Authorization = 'Basic ' + Buffer.from('neo4j:1234').toString('base64');
        const options = {
            url: neoUrl,
            method: 'POST',
            data: body,
            headers: request.headers
        };
        
        proxy.post(options)
            .then((data: any) => {              
                response
                    .type('application/json')
                    .send(data);
            })
            .catch(((err: any) => {                
                let errStatusCode = 500;
                if (err.statusCode) {
                    errStatusCode = err.statusCode;
                }
                console.error('neo4j - Error in get relations for building from: ' + neoUrl + ', err=' + err.message);
                response
                    .status(errStatusCode)
                    .type('application/json')
                    .send({ error: 'neo4j - Error from: ' + neoUrl + ', err=' + err.message });
            }));
    }
);

router.post(
    '/polygonRelations',
    async (request: Request, response: Response): Promise<void> => {     
       
        //get ELOs in polygon       
        if (!request.body.polygon || !request.body.fromDate || !request.body.toDate) {
            response
                .status(400)
                .type('application/json')
                .send({ error: 'polygonRelations - missing parameters to request body' });
            return;
        }
        const layersQueryBody = JSON.parse(JSON.stringify(searchELOsInPolygon));
        layersQueryBody.query.bool.filter.geo_shape.geometry.shape.coordinates = [request.body.polygon];

        let eloIds = []
        const promises = elasticELOsIndexes.map((index) => getELOsForAllIndexs(layersQueryBody, index));
        const responses = await Promise.all(promises);
        responses.forEach(res => {
            if (res?.hits?.hits) {
                eloIds = eloIds.concat(res.hits.hits);
            }
        });
        await getRelationsForELOs(eloIds, response, request.body.fromDate, request.body.toDate);
    }
);



async function getRelationsForELOs(elosIds: any, response: Response, fromDate: string, toDate: string) {

    // for each id return it as a string and join with ,
    // in statement should  be : ['yUeU3XMBbsiNTnsF4sQ8','xUeU3XMBbsiNTnsF4sU8']
    const idList: string = elosIds.map(id => { return "'" + id._id + "'"; }).join(',');
    const body = {
        'statements': [
            {
                'statement': 'MATCH (n:building)-[r:connected]->(b:building) WHERE n.id IN[' + idList + '] AND r.startTime> ' 
                + "'" + fromDate + "'" + ' AND r.endTime< ' + "'" + toDate + "'" + ' return n,b,r',
                'parameters': { 'props': { 'name': 'My Node' } }
            }
        ]
    };


    const options = {
        url: neoUrl,
        method: 'POST',
        data: body,
        // headers: request.headers
        headers: {
            'content-type': 'application/json',
            Authorization: 'Basic ' + Buffer.from('neo4j:1234').toString('base64')
        }
    };

    proxy.post(options)
        .then((data: any) => {
            // key - from building id
            // value - array of all relation results from this building
            const layerToRelationsDictionary = {};
            data.results[0].data.forEach(result => {
                if (layerToRelationsDictionary[result.row[0].id]) {
                    layerToRelationsDictionary[result.row[0].id].push(result);
                }
                else {
                    layerToRelationsDictionary[result.row[0].id] = [result];
                }
            });
            response
                .status(200)
                .type('application/json')
                .send(layerToRelationsDictionary);
        })
        .catch(((err: any) => {
            let statusCode = 500;
            if (err.statusCode) {
                statusCode = err.statusCode;
            }
            console.error('neo4j - Error in get relations for ELOs from: ' + neoUrl + ', err=' + err.message);
            response
                .status(statusCode)
                .type('application/json')
                .send({ error: 'neo4j - Error from: ' + neoUrl + ', err=' + err.message });
        }));
}

// get the elos from elastic
function getELOsForAllIndexs(polygonBody: any, index: string) {
    //for (const index of elasticELOsIndexes) {
        const theUrl = AppConfig.elasticUrl + '/' + index + '/_search?size=1000';
        const options = {
            url: theUrl,
            method: 'POST',
            data: polygonBody
        };
        
        return proxy.post(options).catch(err => {
            console.error('getELOsForAllIndexs: ' + index + 'error: ' + err);
            return { hits: { hits:[] } };
        });
    //}
}


export default router;
