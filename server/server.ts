
import { WebApp } from './App';
import AppConfig from './config';

// Express server used for Http Server + WS Server - for client use
// ----------------------------------------------------------------
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
