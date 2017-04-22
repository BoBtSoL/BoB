// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../../Services/music.service';

import { PlaylistsLoopRoot } from '../../Model/playlistslooproot';
import { PlaylistsLoop } from './playlistsloop';

@Component({
    selector: 'bob-playlists-component',
    templateUrl: './bob-tab-playlists-component.html',
    providers: [MusicService]
})
export class BobTabPlaylistsComponent implements OnInit, OnChanges {

    playlistroot: PlaylistsLoopRoot;
    playlists: PlaylistsLoop[];

    constructor(
        private musicService: MusicService
    ) { }

    ngOnInit() {
        this.musicService.getPlaylists().then(result => {
            this.playlistroot = result;
            this.showResults();
        });
    }

    ngOnChanges() {

    }

    showResults() {
        if (this.playlistroot == null) {
            console.warn('Keine Playlisten gefunden');
        } else {
            console.warn('wuhu, found ' + this.playlistroot.count);
            this.playlists = this.playlistroot.playlists_loop;
        }
    }



}


