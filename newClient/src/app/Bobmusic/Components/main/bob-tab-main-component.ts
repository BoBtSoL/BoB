// Imports
import { Component, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { PlaylistInfoComponent } from './../playlist/playlistinfo.component';
import { MusicService } from '../../Services/music.service';

import { Playerstatus } from '../../Model/playerstatus';
import { Songinfo } from '../../Model/songinfo';

// Component decorator
@Component({
    selector: 'bob-tab-main',
    templateUrl: './bob-tab-main-component.html',
    providers: [MusicService]
})
// Component class
export class BobTabMainComponent implements OnChanges, OnInit {
    model: Playerstatus;
    anotherModel: Playerstatus;
    songInfoArr: Songinfo[];
    lastPlayed: Songinfo[];
    currentplay: Songinfo[];
    currentplay_single: Songinfo;
    nextToPlay: Songinfo[];

    progress: number;
    progressString: string;

    lastplayedToShow = 3;

    // Constructor with injected service
    constructor(
        private musicService: MusicService
    ) {
        this.progress = 10;
        this.anotherModel = new Playerstatus();
        this.anotherModel.mode = 'wow';
    }

    isOnline() {
        if (this.model == null) {
            return false;
        } else {
            return true;
        }
    }

    isPlaying() {
        if (this.model == null) {
            return false;
        }
        if ('play' === this.model.mode) {
            return true;
        } else {
            return false;
        }
    }

    next() {
        this.musicService.next().then(serverstatus => this.model = serverstatus);
    }


    prev() {
        this.musicService.prev().then(serverstatus => this.model = serverstatus);
    }

    play() {
        this.musicService.startPlay().then(serverstatus => this.model = serverstatus);
    }

    pause() {
        this.musicService.startPause().then(serverstatus => this.model = serverstatus);
    }

    checkForChanges(playerstatus: Playerstatus) {
        console.warn('in checkForChanges');
        let changed = false;
        if (this.model == null) {
            this.model = playerstatus;
            changed = true;
            console.warn('Changed ist true.');
        }

        if (this.model != null) {
            if (playerstatus != null) {
                const currIndex = Number(this.model.playlist_cur_index);
                const newIndex = Number(this.model.playlist_cur_index);

                const currTracks = Number(this.model.playlist_tracks);
                const newTracks = Number(playerstatus.playlist_tracks);
                if (currIndex !== newIndex || currTracks !== newTracks) {
                    changed = true;
                    console.warn('Index hat sich verschoben, change ist ebenfalls true');
                }
            }
        }

        this.model = playerstatus;
        this.recalculatePlaylist(changed);
    }

    intVal(n: number | string): number {
        return typeof n === 'number' ? n : parseInt(n, 10);
    }

    isNumeric(n: any): n is number | string {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }



    recreatePlaylistForReal(newSongInfo: Songinfo[], forceRecreate: boolean) {
        console.warn('in real recalculation');
        let changedLocal: boolean;

        changedLocal = false;

        // Erkennen von Änderungen für Performance...
        if (this.currentplay != null && this.currentplay[0] != null && forceRecreate === false) {
            let newNowPlaying: Songinfo;
            const sliceFrom = Number(this.model.playlist_cur_index);
            const sliceTo = Number(this.model.playlist_cur_index) + 1;

            newNowPlaying = newSongInfo.slice(sliceFrom, sliceTo)[0];
            if (newNowPlaying != null) {
                if (newNowPlaying.id == this.currentplay[0].id) {
                    changedLocal = false;
                } else {
                    changedLocal = true;
                }
            }
        }

        if (forceRecreate === true || changedLocal === true) {

            const currIndex = this.intVal(this.model.playlist_cur_index);
            // this.nextToPlay = [];
            if (currIndex === 0) {
                console.warn('Index 0, set lastplayed to null');
                this.currentplay = newSongInfo.slice(0, 1);
                this.currentplay_single = newSongInfo.slice(0, 1)[0];
                this.lastPlayed = [];
                this.nextToPlay = newSongInfo.slice(currIndex + 1, newSongInfo.length);
            } else {

                let tmpLastPlayed: Songinfo[];
                let tmpCurrentPlay: Songinfo[];
                let tmpNextToPlay: Songinfo[];

                tmpLastPlayed =[];
                tmpCurrentPlay=[];
                tmpNextToPlay=[];

                for (const currSongInfo of newSongInfo) {
                    if (this.intVal(currSongInfo.playlist_index) < this.intVal(this.model.playlist_cur_index)) {
                        tmpLastPlayed.push(currSongInfo);
                    }

                    if (this.intVal(currSongInfo.playlist_index) === this.intVal(this.model.playlist_cur_index)) {
                        tmpCurrentPlay.push(currSongInfo);
                    }

                    if (this.intVal(currSongInfo.playlist_index) > this.intVal(this.model.playlist_cur_index)) {
                        tmpNextToPlay.push(currSongInfo);
                    }
                }

                this.lastPlayed = tmpLastPlayed;
                this.currentplay = tmpCurrentPlay;
                this.nextToPlay = tmpNextToPlay;

                this.currentplay_single = this.currentplay[0];
            }

        }

        // progress berechnen
        if (this.model != null && this.currentplay_single != null) {
            if (this.model.time != null && this.currentplay_single.duration != null) {
                let total: number;
                let current: number;
                console.warn('vorm Rechnen');
                const durationString = String(this.currentplay_single.duration);
                const timeString = this.model.time;

                if (durationString != null && durationString != '' && durationString.length > 1) {

                    total = Number(durationString.split('.')[0]);
                    current = Number(timeString.toString().split('.')[0]);
                    this.progress = (current / total) * 100;
                    this.progress = Number(this.progress.toString().split('.')[0]);
                    this.progressString = this.progress.toString();
                    console.warn('Errechnet ' + this.progress);
                } else {
                    this.progress = 0;
                    this.progressString = '0';
                }
            }

        }
    }

    recalculatePlaylist(foreRecreate: boolean) {
        console.warn('in recalulate playlist');
        let currentPlaylistIndex = -1;
        if (this.model != null) {
            currentPlaylistIndex = Number(this.model.playlist_cur_index);
        }

        if (this.model != null) {
            if (currentPlaylistIndex > -1) {
                let calculateFrom = currentPlaylistIndex - this.lastplayedToShow;
                if (calculateFrom < 0) {
                    calculateFrom = 0;
                }
                const calculateTo = 10;
                let newSongInfo: Songinfo[];
                this.musicService.getPlaylistFromTo(calculateFrom.toString(), calculateTo.toString()).then(result => {
                    newSongInfo = result;
                    this.recreatePlaylistForReal(newSongInfo, foreRecreate);
                });
            } else {

                let newSongInfo: Songinfo[];
                this.musicService.getPlaylist().then(result => {
                    newSongInfo = result;
                    this.recreatePlaylistForReal(newSongInfo, foreRecreate);
                });
            }
        }
    }

    ngOnInit() {
        this.progress = 0;
        this.musicService.getStatus2().then(serverstatus => {
            this.model = serverstatus;
            this.recalculatePlaylist(true);
        });

        // this.musicService.getPlaylist().then(result => this.songInfoArr = result);
        const tasksSubscription = this.musicService.getStatusRegular().subscribe(data => {
            this.checkForChanges(data);
        });
    }

    ngOnChanges() {
        // Listen to the 'edit'emitted event so as populate the model
        // with the event payload
        // EmitterService.get(this.editId).subscribe((comment: Comment) => {
        //     this.model = comment;
        //     this.editing = true;
        // });
    }
}
