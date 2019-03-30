import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Status } from './model/status';
import { Message } from './model/Message';
import { ColorModel } from './model/color-model';
import { FadingModel } from './model/fading-model';
import { FadingStatus } from './model/fading-status';
import * as io from 'socket.io-client';

// const baseEndpoint = 'http://localhost:8000/';
// const baseWsUrl = 'http://localhost';

const baseEndpoint = 'http://tsolrasp:8000/';
const baseWsUrl = 'http://tsolrasp';
const wsport = '3001';

const statusEndpoint = baseEndpoint + 'status';
const colorsEndpoint = baseEndpoint + 'colors';
const partyEndpoint = baseEndpoint + 'party';
const fadeEndpoint = baseEndpoint + 'fading';

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

  constructor(private http: HttpClient) {

  }

  getStatus(): Observable<Status> {
    return this.http.get<Status>(statusEndpoint).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getStatus'))
    );
  }

  updateColors(colors: ColorModel): Observable<Status> {
    return this.http.post<any>(colorsEndpoint, JSON.stringify(colors), httpOptions).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('updateColors'))
    );
  }

  // updateStatus(status: Status): Observable<Status> {
  //   return this.http.post<any>(endpoint, JSON.stringify(status), httpOptions).pipe(
  //     map(model => {
  //       return model;
  //     }),
  //     catchError(this.handleError<any>('getStatus'))
  //   );
  // }

  startParty(status: Status): Observable<Status> {
    return this.http.post<any>(partyEndpoint, JSON.stringify(status), httpOptions).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('startParty'))
    );
  }

  stopParty(status: Status): Observable<Status> {
    return this.http.delete<any>(partyEndpoint, httpOptions).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('stopParty'))
    );
  }

  startFading(fadingModel: FadingModel): Observable<FadingStatus> {
    return this.http.post<any>(fadeEndpoint, JSON.stringify(fadingModel), httpOptions).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('startFading'))
    );
  }

  getFadingStatus(): Observable<FadingStatus> {
    return this.http.get<any>(fadeEndpoint, httpOptions).pipe(
      map(model => {
        return model;
      }),
      catchError(this.handleError<any>('getFading'))
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

  getMessages() {
    const observable = new Observable(observer => {
        this.socket = io(baseWsUrl + ':' + wsport);
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


}
