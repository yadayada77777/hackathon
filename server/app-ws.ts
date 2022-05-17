import {
    Server
} from 'http';

import * as WebSocket from 'ws';

// This class is the WS server
// The client is connecting to this server
export class AppWs {

    private wss: WebSocket.Server;

    constructor(server: Server) {

        this.wss = new WebSocket.Server({
            server
        });

        this.wss.on('connection', (ws: WebSocket) => {

            ws.on('message', async () => {

                ws.send('Some Answer', (error) => {
                    if (error) { console.error(error.message); }
                });
            });
        });

    }

    private broadcast(data) {
        const strData = JSON.stringify(data);
        this.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(strData);
            }
        });
    }
}
