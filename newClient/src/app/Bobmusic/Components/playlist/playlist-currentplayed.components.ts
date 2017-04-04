// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../../Model/songinfo';

import { MusicService } from '../../Services/music.service';

// Component decorator
@Component({
    selector: 'playlist-current',
    template: `


<div class="card card-outline-danger transparend-playlist-active-card">
  <div class="card-block">
        <p class="card-text">
          
          <button md-icon-button (click)="play()"><md-icon class="material-icons">play_arrow</md-icon> </button> 
          {{comment.artist}} - {{comment.title}}
            </p> 
        </div>
</div>
    
    

    `
    // No providers here because they are passed down from the parent component
})
// Component class
export class PlaylistCurrentPlayed {

    // Define input properties
    @Input() comment: Songinfo;
    @Input() listId: string;

    constructor(
        private musicService: MusicService
    ) { }

    play() {
        this.musicService.setMasterPlayerPlayPlaylistId(this.comment.playlist_index);
    }

}
