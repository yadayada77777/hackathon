import { WebsocketService } from './WebsocketService';
import { EventEmitter } from 'events';
import { Subscription } from 'rxjs/internal/Subscription';

export enum EVENTS {
    CONNECTED = 'connected',
    MESSAGE = 'message',
    ERROR = 'error',
    CLOSED = 'closed'
}

export class WebsocketUser extends EventEmitter {

    public subscription: Subscription;
    public connectionState = 'DISCONNECTED';

    private wsService: WebsocketService = null;
    private reconnectTimeout = 1000;

    constructor(public url: string) {
        super();
    }

    public async connect() {

        this.wsService = new WebsocketService({ url: this.url });

        try {
            const wsSubject = await this.wsService.connect();

            this.emit(EVENTS.CONNECTED, wsSubject);

            this.connectionState = 'CONNECTED';

            this.subscription = wsSubject.subscribe(
                // SUBJECT MESSAGE === WS MESSAGE EVENT
                (response) => {
                    this.emit(EVENTS.MESSAGE, response);
                },
                // SUBJECT ERROR === WS ERROR EVENT
                (e) => {
                    this.emit(EVENTS.ERROR, e);

                    if (this.wsService.readyState === 2 || this.wsService.readyState === 3) {
                        this.connectionState = 'DISCONNECTED';
                        setTimeout(() => this.connect(), 0);
                    }
                },
                // SUBJECT COMPLETE === WS CLOSE EVENT
                () => {
                    this.connectionState = 'DISCONNECTED';

                    this.emit(EVENTS.CLOSED, new Date());

                    setTimeout(() => this.connect(), this.reconnectTimeout);
                });

        } catch (e) {
            setTimeout(() => this.connect(), this.reconnectTimeout);
        }
    }

    public disconnect() {
        this.subscription.unsubscribe();
        this.wsService.disconnect();
    }

    // public on(eventName: EVENTS, fn: Function) {
    //     super.on(eventName, fn);
    //     return this;
    // }
}
