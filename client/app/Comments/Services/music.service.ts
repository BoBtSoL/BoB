/* * * ./app/comments/services/comment.service.ts * * */
// Imports
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Comment } from '../model/comment';
import { Serverstatus } from '../model/serverstatus';
import { Songinfo } from '../model/songinfo';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MusicService {

    private baseUrl = 'http://192.168.0.18:3000';

    // private instance variable to hold base url
    private commentsUrl = this.baseUrl + '/api/comments';
    private musicUrl = this.baseUrl + '/api/music/status';
    private commandUrl = this.baseUrl + '/api/music/command/';
    private playlistUrl = this.baseUrl + '/api/music/playlist';
    // Resolve HTTP using the constructor
    constructor(private http: Http) { }


    getStatus(): Observable<Serverstatus> {
        return this.http.get(this.musicUrl)
            // ...and calling .json() on the response to return data
            .map(response => response.json() as Serverstatus)
            // ...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getStatus2(): Promise<Serverstatus> {
        return this.http.get(this.musicUrl).toPromise()
            .then(response => response.json() as Serverstatus)
            .catch(this.handleError);
    }

    next(): Promise<Serverstatus> {
        return this.http.get(this.commandUrl + 'next').toPromise()
            .then(response => response.json() as Serverstatus)
            .catch(this.handleError);
    }

    prev(): Promise<Serverstatus> {
        return this.http.get(this.commandUrl + 'prev').toPromise()
            .then(response => response.json() as Serverstatus)
            .catch(this.handleError);
    }


    startPlay(): Promise<Serverstatus> {
        return this.http.get(this.commandUrl + 'play').toPromise()
            .then(response => response.json() as Serverstatus)
            .catch(this.handleError);
    }

    startPause(): Promise<Serverstatus> {
        return this.http.get(this.commandUrl + 'pause').toPromise()
            .then(response => response.json() as Serverstatus)
            .catch(this.handleError);
    }


    startPlayRanom(): Promise<Serverstatus> {
        return this.http.get(this.commandUrl + 'playrandom').toPromise()
            .then(response => response.json() as Serverstatus)
            .catch(this.handleError);
    }

    getPlaylist(): Promise<Songinfo[]> {
        return this.http.get(this.playlistUrl).toPromise()
            .then(response => response.json() as Songinfo[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    // Fetch all existing comments
    getComments(): Observable<Comment[]> {
        // ...using get request
        return this.http.get(this.commentsUrl)
            // ...and calling .json() on the response to return data
            .map(response => response.json() as Comment[])
            // ...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Add a new comment
    addComment(body: Object): Observable<Comment[]> {
        let bodyString = JSON.stringify(body); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this.http.post(this.commentsUrl, body, options) // ...using post request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }

    // Update a comment
    updateComment(body: Object): Observable<Comment[]> {
        let bodyString = JSON.stringify(body); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this.http.put(`${this.commentsUrl}/${body['id']}`, body, options) // ...using put request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
    // Delete a comment
    removeComment(id: string): Observable<Comment[]> {
        return this.http.delete(`${this.commentsUrl}/${id}`) // ...using put request
            .map((res: Response) => res.json()) // ...and calling .json() on the response to return data
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    }
}
