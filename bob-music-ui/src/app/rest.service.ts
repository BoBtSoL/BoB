import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Status } from './model/status';
import { Message } from './model/Message';
import { ColorModel } from './model/color-model';
import { FadingModel } from './model/fading-model';
import { FadingStatus } from './model/fading-status';
import * as io from 'socket.io-client';

import { Playerstatus } from './Model/playerstatus';
import { Player } from './Model/player';
import { Guid } from './Model/guid';

const baseEndpoint = 'http://tsolrasp:8000/';
const wsport = '3001';

const baseServerUrl = '192.168.42.1';
const baseUrl = 'http://192.168.42.1:3000';
const musicUrl = baseUrl + '/api/music/status';


const masterPlayerUrl = baseUrl + '/api/music/get/masterplayer';
const slavePlayerUrl = baseUrl + '/api/music/get/slaveplayer';
const masterPlayerSetVolumeUrl = baseUrl + '/api/music/set/masterplayer/volume/';
const slavePlayerSetVolumeUrl = baseUrl + '/api/music/set/slaveplayer/volume/';


const statusEndpoint = baseEndpoint + 'status';
const colorsEndpoint = baseEndpoint + 'colors';
const partyEndpoint = baseEndpoint + 'party';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class RestService {

  private socket;

  private masterVolumeChangedSource = new Subject<string>();
  public masterVolumeChanged$ = this.masterVolumeChangedSource.asObservable();
  private slaveVolumeChangedSource = new Subject<string>();
  public slaveVolumeChanged$ = this.slaveVolumeChangedSource.asObservable();
  private playlistChangeSource = new Subject<string>();
  public playlistChange$ = this.playlistChangeSource.asObservable();
  private playerStatusChangeSource = new Subject<Playerstatus>();
  public playerStatusChange$ = this.playerStatusChangeSource.asObservable();


  public guid = Guid.newGuid();

  constructor(private http: HttpClient) {

  }

  getMasterPlayer(): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(masterPlayerUrl).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getMasterPlayer'))
    );
  }

  getSlavePlayer(): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(slavePlayerUrl).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getSlavePlayer'))
    );
  }

  getStatusObservable(): Observable<Status> {
    return this.http.get<Status>(statusEndpoint).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getStatus'))
    );
  }

  getStatus(): Observable<Playerstatus> {
    return this.http.get<Status>(musicUrl).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getStatus'))
    );
  }


  setMasterPlayerVolume(volume): Observable<Playerstatus> {
    return this.http.get<Status>(masterPlayerSetVolumeUrl + volume).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('setMasterPlayerVolume'))
    );
  }

  setSlavePlayerVolume(volume): Observable<Playerstatus> {
    return this.http.get<Status>(slavePlayerSetVolumeUrl + volume).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('setMasterPlayerVolume'))
    );
  }



  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getMessagesOld() {
    const observable = new Observable(observer => {
        this.socket = io(baseServerUrl + ':' + wsport);
        this.socket.on('message', (data) => {
            const myObject = <Message>data;
            console.warn('Message is da');
            if (myObject.sender != null) {
                  console.warn('Guids sind NICHT gleich');
                  observer.next(data);
            } else {
                console.warn('Kein sender');
                observer.next(data);
            }
        });
        return () => {
            this.socket.disconnect();
        };
    });

    return observable;
  }

  getMessages() {
    const observable = new Observable(observer => {
        this.socket = io(baseServerUrl + ':' + wsport);
        this.socket.on('message', (data) => {
            const myObject = <Message>data;
            if (myObject.sender != null) {
                if (data.sender === this.guid) {
                    console.warn('Guids sind gleich');
                } else {
                    console.warn('Guids sind NICHT gleich');
                    observer.next(data);
                }
            } else {
                console.warn('Kein sender');
                observer.next(data);
            }
        });
        return () => {
            this.socket.disconnect();
        };
    });
    return observable;
  }

  masterVolumeChanged(command: string) {
    this.masterVolumeChangedSource.next(command);
  }

  slaveVolumeChanged(command: string) {
    this.slaveVolumeChangedSource.next(command);
  }

  playerStatusChanged(playerStatus: Playerstatus) {
    this.playerStatusChangeSource.next(playerStatus);
  }

}
