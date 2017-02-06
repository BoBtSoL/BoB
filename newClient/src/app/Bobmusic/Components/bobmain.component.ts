// Imports
import { Component, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { PlaylistInfoComponent } from './playlistinfo.component';
import { MusicService } from '../services/music.service';

import { Playerstatus } from '../model/playerstatus';
import { Songinfo } from '../model/Songinfo';

// Component decorator
@Component({
    selector: 'appbobmain',
    templateUrl: './bobmain.component.html',
    providers: [MusicService]
})
// Component class
export class BobMainComponent implements OnChanges, OnInit {
    model: Playerstatus;
    anotherModel: Playerstatus;
    songInfoArr: Songinfo[];
    lastPlayed: Songinfo[];
    currentplay: Songinfo[];
    nextToPlay: Songinfo[];

    // Constructor with injected service
    constructor(
        private musicService: MusicService
    ) {
        this.anotherModel = new Playerstatus();
        this.anotherModel.mode = 'wow';
        //const tasksSubscription = musicService.getStatusRegular().subscribe(data => this.model = data);
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
        console.warn('in Data change');
        let changed = false;
        if (this.model == null) {
            this.model = playerstatus;
            changed = true;
            console.warn('Changed ist true 1');
        }
        if (this.model != null) {
            if (playerstatus != null) {
                if (this.model.playlist_cur_index !== playerstatus.playlist_cur_index) {
                    changed = true;
                    console.warn('changed ist true');
                }
            }
        }

        // if (changed === true) {
        this.model = playerstatus;
        this.recalculatePlaylist(changed);
        // }
    }


    recreatePlaylistForReal(newSongInfo: Songinfo[], forceRecreate: boolean) {
        console.warn('in real recalculation');
        let currentoffset = 0;
        let changedLocal: boolean;

        changedLocal = false;


        // Erkennen von Änderungen für Performance...
        if (this.currentplay != null && this.currentplay[0] != null && forceRecreate === false) {

            let comparecurrent: Songinfo[];
            if (this.model.playlist_cur_index === 0) {
                comparecurrent = newSongInfo.slice(0, 1);
            }
            if (this.model.playlist_cur_index === 1) {
                comparecurrent = newSongInfo.slice(1, 2);
            }
            if (comparecurrent != null) {
                if (comparecurrent[0].id === this.currentplay[0].id) {
                    changedLocal = false;
                } else {
                    changedLocal = true;
                }
            }
        }

        if (forceRecreate === true || changedLocal === true) {
            // this.nextToPlay = [];
            if (this.model.playlist_cur_index === 0) {
                console.warn('Index 0, set lastplayed to null');
                this.currentplay = newSongInfo.slice(0, 1);
                this.lastPlayed = [];
                currentoffset = 1;
            }
            if (this.model.playlist_cur_index === 1) {
                console.warn('Index 1, set lastplayed to correct value');
                this.lastPlayed = newSongInfo.slice(0, 1);
                this.currentplay = newSongInfo.slice(1, 2);
                console.warn('lastplayed: ' + this.lastPlayed);
                currentoffset = 2;
            }
            this.nextToPlay = newSongInfo.slice(currentoffset, newSongInfo.length);
        }
    }

    recalculatePlaylist(foreRecreate: boolean) {
        console.warn('in recalulate playlist');
        if (this.model != null) {

            let newSongInfo: Songinfo[];
            this.musicService.getPlaylist().then(result => {
                console.warn('Calling actual recreation');
                newSongInfo = result;
                this.recreatePlaylistForReal(newSongInfo, foreRecreate);
            });
        }
    }

    ngOnInit() {
        //this.musicService.getPlaylist().then(result => this.songInfoArr = result);
        const tasksSubscription = this.musicService.getStatusRegular().subscribe(data => {
            this.checkForChanges(data);
            // this.model = data;
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
