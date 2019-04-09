import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, Subject, fromEventPattern } from 'rxjs';
import { map, catchError, tap, flatMap } from 'rxjs/operators';
import { interval } from 'rxjs';
import { Message } from './model/Message';
import { ColorModel } from './model/color-model';
import { FadingModel } from './model/fading-model';
import { FadingStatus } from './model/fading-status';
import * as io from 'socket.io-client';

import { Playerstatus } from './Model/playerstatus';
import { Songinfo } from './Model/songinfo';
import { Player } from './Model/player';
import { Guid } from './Model/guid';
import { SongSearchResult } from './model/songs-search-result';
import { FavoriteRoot } from './model/favorite-root';

const baseEndpoint = 'http://tsolrasp:8000/';
const wsport = '3001';

const baseServerUrl = '192.168.42.1';
const baseUrl = 'http://192.168.42.1:3000';
const musicUrl = baseUrl + '/api/music/status';
const commandUrl = baseUrl + '/api/music/command/';

const masterPlayerUrl = baseUrl + '/api/music/get/masterplayer';
const slavePlayerUrl = baseUrl + '/api/music/get/slaveplayer';
const masterPlayerSetVolumeUrl = baseUrl + '/api/music/set/masterplayer/volume/';
const slavePlayerSetVolumeUrl = baseUrl + '/api/music/set/slaveplayer/volume/';
const masterPlayerPlayPlaylistId = baseUrl + '/api/music/set/masterplayer/play/';


const statusEndpoint = baseEndpoint + 'status';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
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

  getStatusObservable(): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(statusEndpoint).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getStatus'))
    );
  }

  getStatus(): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(musicUrl).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getStatus'))
    );
  }

  getStatusRegular(): Observable<Playerstatus> {
    return interval(5000).pipe(flatMap(() => {
      return this.http.get<Playerstatus>(musicUrl);
    }));
  }

  getPlaylistFromTo(from: string, to: string): Observable<Songinfo[]> {
    return this.http.get<Playerstatus>(baseUrl + '/api/music/get/playlist/' + from + '/' + to).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getStatus'))
    );
  }

  getFavorites(): Observable<FavoriteRoot> {
    return this.http.get<FavoriteRoot>(baseUrl + '/api/music/favorites').pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getFavorites'))
    );
  }

  addFavoriteToPlaylist(favId: string): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(baseUrl + '/api/music/favorite/add/' + favId).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('addFavoriteToPlaylist'))
    );
  }

  playFavoriteNow(favId: string): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(baseUrl + '/api/music/favorite/play/' + favId).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getFavorites'))
    );
  }

  setMasterPlayerVolume(volume): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(masterPlayerSetVolumeUrl + volume).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('setMasterPlayerVolume'))
    );
  }

  setSlavePlayerVolume(volume): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(slavePlayerSetVolumeUrl + volume).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('setMasterPlayerVolume'))
    );
  }

  setMasterPlayerPlayPlaylistId(id: number): Observable<Playerstatus> {
    this.playlistChanged('show');
    return this.http.get<Playerstatus>(masterPlayerPlayPlaylistId + id.toString()).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('setMasterPlayerVolume'))
    );
  }

  next(): Observable<Playerstatus> {
    this.playlistChanged('show');
    return this.http.get<Playerstatus>(commandUrl + 'next/' + this.guid).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('next'))
    );
  }

  prev(): Observable<Playerstatus> {
    this.playlistChanged('show');
    return this.http.get<Playerstatus>(commandUrl + 'prev/' + this.guid).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('prev'))
    );
  }

  play(): Observable<Playerstatus> {
    this.playlistChanged('show');
    return this.http.get<Playerstatus>(commandUrl + 'play/' + this.guid).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('play'))
    );
  }

  pause(): Observable<Playerstatus> {
    this.playlistChanged('show');
    return this.http.get<Playerstatus>(commandUrl + 'pause/' + this.guid).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('pause'))
    );
  }

  addToPlaylist(id: number): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(baseUrl + '/api/music/set/masterplayer/addtoplaylist/' + id).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('play'))
    );
  }

  playNow(id: number): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(baseUrl + '/api/music/set/masterplayer/addtoplaylist/' + id).pipe(
      map(model => {
        return this.next();
      }),
      catchError(this.handleError<any>('play'))
    );
  }

  performeSongSearch(song: string): Observable<SongSearchResult> {
    return this.http.get<Playerstatus>(baseUrl + '/api/music/search/song/' + song).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('play'))
    );
  }

  resetServer(): Observable<Playerstatus> {
    return this.http.get<Playerstatus>(baseUrl + '/api/music/reset').pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('resetServer'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
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

  playlistChanged(command: string) {
    this.playlistChangeSource.next(command);
  }

}
