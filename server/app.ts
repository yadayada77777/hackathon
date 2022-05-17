import express = require('express');
import { Application } from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { NextFunction } from 'express';
import bodyParser = require('body-parser');
const path = require('path');
import * as os from 'os';
var cors = require('cors');
import * as http from 'http';
import { Server } from 'http';
import { AppWs } from './app-ws';
import AppConfig from './config';
// Middleware for saving data per Http request
import correlationMiddleware = require('./utils/correlationMiddleware');

// and start logging
console.info("I am logging ;-)");

import freeDraws_router from './routes/freeDraws';
import layers_routes from './routes/ELO';
import neo_route from './routes/neoForj'

import scraperroute from './routes/techCare';

import { buisinessLogic } from './scarp/techCare_buisinessLogic';


export class WebApp {

    public express: Application;
    public server: Server;
    public wss: AppWs;


    constructor() {

        this.express = express();
        //cors
        this.express.use(cors());

        this.express.use(bodyParser.urlencoded({
            extended: false,
            limit: '3mb'
        }));

        this.express.use(bodyParser.json({
            limit: '3mb'
        }));


        // Point static path to dist
        this.express.use(express.static(path.join(__dirname, 'client')));


        // Catch all other routes and return the index file
        this.express.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });

        this.express.use(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ((error: any, request: Request, response: Response, next: NextFunction) => {

                if (error) {
                    console.error('Server Error: ', error);
                }
                response
                    .status(500)
                    .type('text/plain')
                    .send('Internal Server Error, check log for details');

            })
        );

        this.express.use(bodyParser.urlencoded({ extended: true }));


        // CORRELATION ID
        this.express.use(correlationMiddleware.middleware);



        // IMPL
        //this.express.use('/', clientConfig_router);
        // this.express.use('/', freeDraws_router);
        // this.express.use('/', layers_routes);
        // this.express.use('/', neo_route);

        this.express.use('/', scraperroute);

        // Create http server
        this.server = http.createServer(this.express);

        // WS Server - Augment the server with websocket interface
        this.wss = new AppWs(this.server);

        buisinessLogic.init("https://www.askp.co.il/");

    }

}


const myApp = new WebApp();
// Start listening on Http Server + WS Server
myApp.server.listen(
    AppConfig.webServerPort,
    (() => {
        console.log('Application listening on port :' + AppConfig.webServerPort);
    })
);

// Listen for uncaught exceptions - these are errors that are thrown outside the
// context of the Express.js route handlers and other proper async request handling.
process.on(
    'uncaughtException',
    function handleError(error: any): void {
        console.error('Catastrophic error: ' + error);
    }
);





/*
import * as  express from 'express';
const http = require('http');
const path = require('path');
//const topicalExpress = require('esl-topical');
var cors = require('cors');
const bodyParser = require("body-parser");

console.log('Started Gmuav Web Client');

const app = express();

//cors
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Point static path to dist
app.use(express.static(path.join(__dirname, 'client')));


// Catch all other routes and return the index file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port =  '3010';
app.set('port', port);



const server = app.listen(port).on('listening', function () {
    console.log('starting');

});

process.on('uncaughtException', function (err) {
    console.log(err);
})


module.exports = app;



*/






