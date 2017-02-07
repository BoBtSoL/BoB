// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../model/songinfo';


// Component decorator
@Component({
    selector: 'playlist-last',
    template: `


    <div class="card">
        <div class="card-header">Last played</div>
        <div class="card-block">
        <p class="card-text">{{comment.artist}} - {{comment.title}}</p>
        </div>
    </div>
    <br>
    

    `
    // No providers here because they are passed down from the parent component
})
// Component class
export class PlayListLastPlayed {

    // Define input properties
    @Input() comment: Songinfo;
    @Input() listId: string;

    // Constructor
    constructor(
    ) { }


}
