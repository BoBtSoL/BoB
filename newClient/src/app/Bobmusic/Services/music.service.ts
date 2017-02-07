/* * * ./app/comments/services/comment.service.ts * * */
// Imports
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Playerstatus } from '../model/playerstatus';
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
    private masterPlayerUrl = this.baseUrl + '/api/music/get/masterplayer';
    private slavePlayerUrl = this.baseUrl + '/api/music/get/slaveplayer';
    private masterPlayerSetVolumeUrl = this.baseUrl + '/api/music/set/masterplayer/volume/';
    private masterPlayerPlayPlaylistId = this.baseUrl + '/api/music/set/masterplayer/play/';
    private slavePlayerSetVolumeUrl = this.baseUrl + '/api/music/set/slaveplayer/volume/';
    // Resolve HTTP using the constructor
    constructor(private http: Http) { }


    getStatusRegular(): Observable<Playerstatus> {
        return Observable.interval(5000)
            .switchMap(() => this.http.get(this.musicUrl))
            //flatMapLatest(() => http.get(this.musicUrl))
            .map(response => response.json() as Playerstatus);
        // return this.http.get()
        // ...and calling .json() on the response to return data
        //     .map(response => response.json() as Serverstatus)
        // ...errors if any
        //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getStatus(): Observable<Playerstatus> {
        return this.http.get(this.musicUrl)
            // ...and calling .json() on the response to return data
            .map(response => response.json() as Playerstatus)
            // ...errors if any
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getStatus2(): Promise<Playerstatus> {
        return this.http.get(this.musicUrl).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    next(): Promise<Playerstatus> {
        return this.http.get(this.commandUrl + 'next').toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    prev(): Promise<Playerstatus> {
        return this.http.get(this.commandUrl + 'prev').toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }


    startPlay(): Promise<Playerstatus> {
        return this.http.get(this.commandUrl + 'play').toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    startPause(): Promise<Playerstatus> {
        return this.http.get(this.commandUrl + 'pause').toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }


    startPlayRanom(): Promise<Playerstatus> {
        return this.http.get(this.commandUrl + 'playrandom').toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    getPlaylist(): Promise<Songinfo[]> {
        return this.http.get(this.playlistUrl).toPromise()
            .then(response => response.json() as Songinfo[])
            .catch(this.handleError);
    }

    getMasterPlayer(): Promise<Playerstatus> {
        return this.http.get(this.masterPlayerUrl).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    setMasterPlayerVolume(volume): Promise<Playerstatus> {
        return this.http.get(this.masterPlayerSetVolumeUrl + volume).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    setMasterPlayerPlayPlaylistId(id): Promise<Playerstatus> {
        return this.http.get(this.masterPlayerPlayPlaylistId + id).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    getSlavePlayer(): Promise<Playerstatus> {
        return this.http.get(this.masterPlayerUrl).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    setSlavePlayerVolume(volume): Promise<Playerstatus> {
        return this.http.get(this.masterPlayerSetVolumeUrl + volume).toPromise()
            .then(response => response.json() as Playerstatus)
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


}
