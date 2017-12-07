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
        <div>
            <button (click)="playNow()" type="button" [disabled]="addedStatus>0" class="btn btn-outline-danger">
                PLAY NOW
            </button>
            <button (click)="addToPlaylist()" type="button" [disabled]="addedStatus>0" class="btn btn-outline-danger">ADD</button>
            
            <span *ngIf="addedStatus==1" class="text-warning right-float">
                <i class="material-icons">warning</i> ...Arbeite...
            </span>
            <span *ngIf="addedStatus==2" class="text-success right-float">
                <i class="material-icons">done</i> Erfolgreich hinzugefügt
            </span>
            
            

        </div>
    </div>
</div>   
   `
})
// Component class
export class ResultInfoComponent {

    // Define input properties
    @Input() comment: Songinfo;
    @Input() listId: string;


    addedStatus = 0;

    constructor(
        private musicService: MusicService
    ) { }

    playNow() {
        this.addedStatus = 1;
        this.musicService.addToPlaylist(this.comment.id).then(result => this.musicService.next()).then(result2 => this.addedStatus = 2);

        //this.musicService.playNow(this.comment.id);
    }

    addToPlaylist() {
        this.addedStatus = 1;
        this.musicService.addToPlaylist(this.comment.id).then(result => this.addedStatus = 2);
    }





}
