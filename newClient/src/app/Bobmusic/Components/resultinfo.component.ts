// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../Model/songinfo';

import { MusicService } from '../Services/music.service';

// Component decorator
@Component({
    selector: 'resulinfo-component',
    template: `


<div class="card">
    <div class="card-block">
        <p class="card-text">
            {{comment.artist}} - {{comment.title}}
        </p>
    </div>
    <div class="card-footer">
                <button md-button (click)="playNow()">PLAY NOW</button>
            <button md-button (click)="addToPlaylist()">ADD</button>
     <!--<small class="text-muted">Player online</small>-->
    </div>
</div>


    <br>
    
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
