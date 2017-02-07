// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../model/songinfo';

import { MusicService } from '../services/music.service';

// Component decorator
@Component({
    selector: 'playlist-box',
    template: `


    <div class="card">
        <!--<div class="card-header">Next</div>-->
        <div class="card-block">
        <p class="card-text">{{comment.artist}} - {{comment.title}}</p>
        </div>
        
        
        <div class="card-footer text-center">
            <button (click)="play()" md-icon-button><md-icon class="material-icons">play_arrow</md-icon></button>
        </div>
    </div>
    <br>
    

    `
    // No providers here because they are passed down from the parent component
})
// Component class
export class PlaylistInfoComponent {

    // Define input properties
    @Input() comment: Songinfo;
    @Input() listId: string;

    constructor(
        private musicService: MusicService
    ) { }

    play() {
        this.musicService.setMasterPlayerPlayPlaylistId(this.comment.playlist_index);
        // todo. Magie...
    }





}
