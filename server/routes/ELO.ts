import express = require('express');
import { Request } from 'express';
import { Response } from 'express';
import AppConfig from '../config';

import * as searchLayer from '../services/elasticQueries/searchELO.json';
//import * as searchLayer from '../services/elasticQueries/searchELO.json';
import * as updateLayer from '../services/elasticQueries/updateELO.json';

const router = express.Router();

import proxy from '../utils/proxy';


// get layers
router.get(
    '/layers',
    async (request: Request, response: Response): Promise<void> => {
        const layerType = request.query.type;
        const elasticUrl = AppConfig.elasticUrl + '/' + layerType + '/_search?size=10000';
        const options = {
            url: elasticUrl,
            method: 'GET'
        };
        proxy.get(options)
            .then((data: any) => {
                console.info('loading ELOs returned : ' + data.hits.hits.length + ' results');
                response
                    .status(200)
                    .type('application/json')
                    .send(data);
            })
            .catch(((err: any) => {
                console.error('error loading ELOs: ' + layerType + 'error: ' + err)
                response
                    .status(err.statusCode)
                    .type('application/json')
                    .send({ error: 'getLayers - Error in getting layers from: ' + elasticUrl + ', err=' + err.message });
            }));
    }
);

// get layers by filters
// request body:
// {
//     properties?: string[] // fields of layer that will be returned (if null return all fields)
// 	   searchValue: string ,
//     types: string[] // layer type (relevant in building case)
// }
router.post(
    '/layers',
    async (request: Request, response: Response): Promise<void> => {
        const layerType = request.query.type;
        const queryBody: any = JSON.parse(JSON.stringify(searchLayer));  //make a copy
        if (request.body.properties && request.body.properties.length > 0) {
            queryBody._source = request.body.properties;
        } else {
            // return all ELO properties
            delete queryBody._source;
        }

        // types
        if (request.body.types && request.body.types.length > 0) {
            request.body.types.forEach((obj) => {
                queryBody.query.bool.should.push({
                    'match': {
                        'properties.type': obj
                    }
                });
            });
        } else {
            // remove layer type section from query
            delete queryBody.query.bool.should;
            delete queryBody.query.bool.minimum_should_match;
        }

        // search text
        if (request.body.searchValue && request.body.searchValue !== '') {
            queryBody.query.bool.filter.push({
                'match_all': {}
            });
            queryBody.query.bool.filter.push(
                {
                    'multi_match': {
                        'query': request.body.searchValue,
                        'operator': 'and',
                        'type': 'phrase_prefix',
                        'fields': [
                            '*'
                        ]
                    }
                }
            );
        } else {
            // remove search text section from query
            delete queryBody.query.bool.filter;
        }
        const elasticUrl = AppConfig.elasticUrl + '/' + layerType + '/_search?size=10000';
        const options = {
            url: elasticUrl,
            method: 'POST',
            data: queryBody
        };
        proxy.post(options)
            .then((filteredELOs: any) => {
                console.info('getting ELOs by filters returned : ' + filteredELOs.hits.hits.length + ' results');
                response
                    .type('application/json')
                    .send(filteredELOs);
            })
            .catch(((error: any) => {
                console.error('error getting ELOs by filters: ' + layerType + 'error: ' + error)
                response
                    .status(error.statusCode)
                    .type('application/json')
                    .send({ error: 'getLayers - Error in getting layers from: ' + elasticUrl + ', err=' + error.message });
            }));
    }
);

// update layers properties
// request body:
// {
//     grade: number
//     type: string
// }
router.post(
    '/updateLayers/:layerId',
    async (request: Request, response: Response): Promise<void> => {
        const layerType = request.query.type;
        const layerId = request.params.layerId;
        if (!request.body.type && !request.body.grade) {
            response
                .status(400)
                .type('application/json')
                .send({ error: 'updateLayer - missing parameters to request body' });
            return;
        }
        const queryBody: any = JSON.parse(JSON.stringify(updateLayer));  //make a copy
        if (request.body.type) {
            // update layer type
            queryBody.doc.properties.type = request.body.type;
        } else {
            // delete update type section
            delete queryBody.doc.properties.type;
        }
        if (request.body.grade) {
            // update layer grade
            queryBody.doc.properties.grade = request.body.grade;
        } else {
            // delete update grade section
            delete queryBody.doc.properties.grade;
        }
        if (request.body.name) {
            // update layer name
            queryBody.doc.properties.name = request.body.name;
        } else {
            // delete update name section
            delete queryBody.doc.properties.name;
        }
        const elasticUrl = AppConfig.elasticUrl + '/' + layerType + '/_doc/' + layerId + '/_update';
        const options = {
            url: elasticUrl,
            method: 'POST',
            data: queryBody
        };
        proxy.post(options)
            .then((data: any) => {
                response
                    .type('application/json')
                    .send(data);
            })
            .catch(((err: any) => {
                let errorStatusCode = 500;
                if (err.statusCode) {
                    errorStatusCode = err.statusCode;
                }
                console.error('error updating ELO: ' + layerType + 'error: ' + err)
                response
                    .status(errorStatusCode)
                    .type('application/json')
                    .send({ error: 'update ELO - Error in updating ELO from: ' + elasticUrl + ', err=' + err.message });
            }));
    }
);
export default router;
