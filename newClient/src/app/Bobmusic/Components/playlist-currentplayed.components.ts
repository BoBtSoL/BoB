// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../model/songinfo';


// Component decorator
@Component({
    selector: 'playlist-current',
    template: `


    <div class="card card-inverse" style="background-color: #2b2b2b; border-color: #333;">
        <div class="card-header">Currently playiing</div>
        <div class="card-block">
        <!--<h4 class="card-title">{{comment.title}}</h4>-->
        <p class="card-text">{{comment.artist}} - {{comment.title}}</p>
        </div>

    </div>
    <br>

    

    `
    // No providers here because they are passed down from the parent component
})
// Component class
export class PlaylistCurrentPlayed {

    // Define input properties
    @Input() comment: Songinfo;
    @Input() listId: string;

    // Constructor
    constructor(
    ) { }


}
