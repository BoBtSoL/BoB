// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../model/songinfo';

import { MusicService } from '../services/music.service';

// Component decorator
@Component({
    selector: 'resulinfo-component',
    template: `


    <md-card>
        <md-card-header>
            <md-card-title>Ergebnis</md-card-title>
        </md-card-header>
        <md-card-content>
                <p>{{comment.artist}}</p>
                <p>{{comment.title}}<p>
        </md-card-content>
        <md-card-actions>
            <button md-button (click)="playNow()">PLAY NOW</button>
            <button md-button (click)="addToPlaylist()">ADD</button>
        </md-card-actions>

        </md-card>
    <br>
    

    `
    // No providers here because they are passed down from the parent component
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
