// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../../Model/songinfo';

import { MusicService } from '../../Services/music.service';

// Component decorator
@Component({
    selector: 'resulinfo-component',
    template: `

<div class="card transparend-card">
    <div class="card-block">
        <p class="card-text">
            {{comment.artist}} - {{comment.title}}
        </p>

        <button (click)="playNow()" type="button" class="btn btn-outline-danger">PLAY NOW</button>
        <button (click)="addToPlaylist()" type="button" class="btn btn-outline-danger">ADD</button>
    </div>
</div>   
   `
})
// Component class
export class ResultInfoComponent {

    // Define input properties
    @Input() comment: Songinfo;
    @Input() listId: string;

    constructor(
        private musicService: MusicService
    ) { }

    playNow() {
        this.musicService.playNow(this.comment.id);
    }

    addToPlaylist() {
        this.musicService.addToPlaylist(this.comment.id);
    }





}
