/* * * ./app/comments/services/comment.service.ts * * */
// Imports
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Playerstatus } from '../Model/playerstatus';
import { Player } from '../Model/player';
import { PlaylistsLoopRoot } from '../Model/playlistslooproot';
import { SyncGroupRoot } from '../Model/syncgrouproot';
import { Songinfo } from '../Model/songinfo';
import { SongSearchResult } from '../Model/songs-search-result';
import { Serveronline } from '../Model/serveronline';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MusicService {

    //baseUrl = 'http://192.168.0.18:3000';
    baseUrl = 'http://192.168.42.1:3000';
    //baseServerUrl = '192.168.0.18';
    baseServerUrl = '192.168.42.1';
    baseServerPort = 3000;

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

    private statusSuffix = '/api/server/status';
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
        return this.http.get(this.masterPlayerPlayPlaylistId + id).toPromise()
            .then(response => response.json() as Playerstatus)
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
        return this.http.get(this.playTrackNowUrl + id).toPromise()
            .then(response => response.json() as Playerstatus)
            .catch(this.handleError);
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
        this.http.get(this.resetUrl);
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
