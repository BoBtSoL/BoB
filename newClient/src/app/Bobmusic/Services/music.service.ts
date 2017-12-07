/* * * ./app/comments/services/comment.service.ts * * */
// Imports
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Playerstatus } from '../Model/playerstatus';
import { Player } from '../Model/player';
import { Guid } from '../Model/guid';
import { PlaylistsLoopRoot } from '../Model/playlistslooproot';
import { SyncGroupRoot } from '../Model/syncgrouproot';
import { Songinfo } from '../Model/songinfo';
import { SongSearchResult } from '../Model/songs-search-result';
import { Serveronline } from '../Model/serveronline';
import { Message } from '../Model/message';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import * as io from 'socket.io-client';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MusicService {

    //baseUrl = 'http://192.168.0.18:3000';
    baseServerUrl = '192.168.42.1';
    baseUrl = 'http://192.168.42.1:3000';
    wsport = '3001';
    baseServerPort = 3000;

    //baseServerUrl = '192.168.0.18';

    // private instance variable to hold base url
    private commentsUrl = this.baseUrl + '/api/comments';
    private musicUrl = this.baseUrl + '/api/music/status';
    private commandUrl = this.baseUrl + '/api/music/command/';
    private playlistUrl = this.baseUrl + '/api/music/playlist';
    private playlisFromTotUrl = this.baseUrl + '/api/music/get/playlist/';
    private masterPlayerUrl = this.baseUrl + '/api/music/get/masterplayer';
    private slavePlayerUrl = this.baseUrl + '/api/music/get/slaveplayer';
    private masterPlayerSetVolumeUrl = this.baseUrl + '/api/music/set/masterplayer/volume/';
    private masterPlayerPlayPlaylistId = this.baseUrl + '/api/music/set/masterplayer/play/';
    private slavePlayerSetVolumeUrl = this.baseUrl + '/api/music/set/slaveplayer/volume/';
    private artistSearchUrl = this.baseUrl + '/api/music/search/artist/';
    private songSearchUrl = this.baseUrl + '/api/music/search/song/';
    private addTrackUrl = this.baseUrl + '/api/music/set/masterplayer/addtoplaylist/';
    private playTrackNowUrl = this.baseUrl + '/api/music/set/masterplayer/startenow/';

    private addPlaylistUrl = this.baseUrl + '/api/music/set/masterplayer/addplaylist/';
    private setPlaylistUrl = this.baseUrl + '/api/music/set/masterplayer/startplaylistnow/';

    private getSyncGroupsUrl = this.baseUrl + '/api/music/syncgroups/get/';
    private resetUrl = this.baseUrl + '/api/music/reset';
    private getAllPlayersUrl = this.baseUrl + '/api/music/players/get';
    private getPlaylistsUrl = this.baseUrl + '/api/music/get/playlists';

    private socket;

    private statusSuffix = '/api/server/status';

    public guid = Guid.newGuid();

    // Observable string sources
    private masterVolumeChangedSource = new Subject<string>();
    private slaveVolumeChangedSource = new Subject<string>();
    private playlistChangeSource = new Subject<string>();

    // Observable string streams
    masterVolumeChanged$ = this.masterVolumeChangedSource.asObservable();
    laveVolumeChanged$ = this.slaveVolumeChangedSource.asObservable();
    playlistChange$ = this.playlistChangeSource.asObservable();

    // Resolve HTTP using the constructor
    constructor(private http: Http) { }

    testUrl(newUrl: string, newPort: number): Promise<Serveronline> {
        return this.http.get('http://' + newUrl + ':' + newPort + this.statusSuffix).toPromise()
            .then(response => response.json() as Serveronline)
            .catch(this.handleError);
    }

    setBaseUrl(newUrl: string, newPort: number) {
        this.baseServerUrl = newUrl;
        this.baseServerPort = newPort;
        this.baseUrl = 'http://' + newUrl + ':' + newPort;
    }

    getBaseUrlConcatinaitet() {
        return 'http://' + this.baseServerUrl + ':' + this.baseServerPort;
    }

    getStatusRegular(): Observable<Playerstatus> {
        return Observable.interval(5000)
            .switchMap(() => this.http.get(this.musicUrl))
            .map(response => response.json() as Playerstatus);
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
        this.playlistChanged('show');
        return this.http.get(this.commandUrl + 'next' + '/' + this.guid).toPromise()
             .then(response => response.json() as Playerstatus)
            //.then(res => this.playlistChanged('hide'))
            .catch(this.handleError);
    }

    prev(): Promise<Playerstatus> {
        this.playlistChanged('show');
        return this.http.get(this.commandUrl + 'prev' + '/' + this.guid).toPromise()
            .then(response => response.json() as Playerstatus)
            //.then(res => this.playlistChanged('hide'))
            .catch(this.handleError);
    }


    startPlay(): Promise<Playerstatus> {
        //this.playlistChanged('show');
        return this.http.get(this.commandUrl + 'play' + '/' + this.guid).toPromise()
            .then(response => response.json() as Playerstatus)
            //.then(res => this.playlistChanged('hide'))
            .catch(this.handleError);
    }

    startPause(): Promise<Playerstatus> {
        //this.playlistChanged('show');
        return this.http.get(this.commandUrl + 'pause' + '/' + this.guid).toPromise()
            .then(response => response.json() as Playerstatus)
            //.then(res => this.playlistChanged('hide'))
            .catch(this.handleError);
    }


    startPlayRanom(): Promise<Playerstatus> {
        return this.http.get(this.commandUrl + 'playrandom' + '/' + this.guid).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    getPlaylist(): Promise<Songinfo[]> {
        return this.http.get(this.playlistUrl + '/' + this.guid).toPromise()
            .then(response => response.json() as Songinfo[])
            .catch(this.handleError);
    }

    getPlaylistFromTo(from: string, to: string): Promise<Songinfo[]> {
        return this.http.get(this.playlisFromTotUrl + from + '/' + to).toPromise()
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
        this.playlistChanged('show');
        return this.http.get(this.masterPlayerPlayPlaylistId + id).toPromise()
            .then(response => response.json() as Playerstatus)
            //.then(res => this.playlistChanged('hide'))
            .catch(this.handleError);
    }

    getSlavePlayer(): Promise<Playerstatus> {
        return this.http.get(this.slavePlayerUrl).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    setSlavePlayerVolume(volume): Promise<Playerstatus> {
        return this.http.get(this.slavePlayerSetVolumeUrl + volume).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    performeArtistSearch(artist: string): Promise<SongSearchResult> {
        return this.http.get(this.artistSearchUrl + artist).toPromise()
            .then(response => response.json() as SongSearchResult)
            .catch(this.handleError);
    }

    performeSongSearch(song: string): Promise<SongSearchResult> {
        return this.http.get(this.songSearchUrl + song).toPromise()
            .then(response => response.json() as SongSearchResult)
            .catch(this.handleError);
    }

    addToPlaylist(id: number): Promise<Playerstatus> {
        return this.http.get(this.addTrackUrl + id).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    playNow(id: number): Promise<Playerstatus> {
        return this.http.get(this.addTrackUrl + id).toPromise()
            .then(response => {
                response.json() as Playerstatus;
                return this.next();
            })
            .catch(this.handleError);

        // return this.http.get(this.playTrackNowUrl + id).toPromise()
        //   .then(response => response.json() as Playerstatus)
        //    .catch(this.handleError);
    }

    addPlaylist(id: number): Promise<Playerstatus> {
        return this.http.get(this.addPlaylistUrl + id).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    setPlaylist(id: number): Promise<Playerstatus> {
        return this.http.get(this.setPlaylistUrl + id).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
    }

    getSyncGroups(): Promise<SyncGroupRoot> {
        return this.http.get(this.getSyncGroupsUrl).toPromise()
            .then(response => response.json() as SyncGroupRoot)
            .catch(this.handleError);
    }

    resetServer() {
        this.http.get(this.resetUrl).toPromise()
            .then(response => response.json() as Playerstatus);
    }

    getAllPlayers(): Promise<Player[]> {
        return this.http.get(this.getAllPlayersUrl).toPromise()
            .then(response => response.json() as Player[])
            .catch(this.handleError);
    }

    getPlaylists(): Promise<PlaylistsLoopRoot> {
        return this.http.get(this.getPlaylistsUrl).toPromise()
            .then(response => response.json() as PlaylistsLoopRoot)
            .catch(this.handleError);
    }

    getMessages() {
        let observable = new Observable(observer => {
            this.socket = io(this.baseServerUrl + ':' + this.wsport);
            this.socket.on('message', (data) => {
                let myObject = <Message>data;
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



    private handleError(error: any): Promise<any> {
        //console.error('An error occurred', error); // for demo purposes only
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

    masterVolumeChanged(command: string) {
        this.masterVolumeChangedSource.next(command);
    }

    slaveVolumeChanged(command: string) {
        this.slaveVolumeChangedSource.next(command);
    }

    playlistChanged(command: string) {
        this.playlistChangeSource.next(command);
    }

}
