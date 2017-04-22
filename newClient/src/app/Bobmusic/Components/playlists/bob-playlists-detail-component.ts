// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistsLoop } from '../../Model/playlistsloop';

import { MusicService } from '../../Services/music.service';

// Component decorator
@Component({
    selector: 'plylists-detail-component',
    template: `

<div class="card transparend-card">
    <div class="card-block">
        <p class="card-text">
            {{comment.playlist}}
        </p>

        <button (click)="setPlaylist()" type="button" class="btn btn-outline-danger">PLAY NOW</button>
        <button (click)="addPlaylist()" type="button" class="btn btn-outline-danger">ADD PLAYLIST</button>
    </div>
</div>   
   `
})
// Component class
export class BobPlaylistsDetailComponent {

    // Define input properties
    @Input() comment: PlaylistsLoop;

    constructor(
        private musicService: MusicService
    ) { }


    addPlaylist() {
        this.musicService.addPlaylist(this.comment.id);
    }

    setPlaylist() {
        this.musicService.setPlaylist(this.comment.id);
    }
}
