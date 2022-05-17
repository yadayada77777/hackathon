import { Observer, Observable, Subject } from 'rxjs';

import WebSocket = require('ws');

export interface IWebSocketServiceOptions {
  url: string;
}

export class WebsocketService {

  public ws;

  private wsOptions = {
    url: ''
  };

  constructor(options: IWebSocketServiceOptions) {
    this.wsOptions = {
      ...this.wsOptions,
      ...options
    };
  }

  public connect(): Promise<Subject<any>> {
    this.ws = new WebSocket(this.wsOptions.url);

    //#region FOR SUBJECT CREATION
    const observable = Observable.create(
      (obs: Observer<any>) => {
        this.ws.onmessage = obs.next.bind(obs);
        this.ws.onerror = obs.error.bind(obs);
        this.ws.onclose = obs.complete.bind(obs);

        return this.ws.close.bind(this.ws);
      });

    const observer = {
      next: (data: any) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(data);
        }
      }
    };
    //#endregion FOR SUBJECT CREATION

    return new Promise((resolve, reject) => {
      this.ws.addEventListener('open', () => {
        const subject = Subject.create(observer, observable);
        resolve(subject);
      });

      this.ws.addEventListener('error', (e) => {
        reject(e);
      });
    });
  }

  public disconnect() {
    this.ws.close();
  }

  get readyState() {
    return this.ws.readyState;
  }
}
