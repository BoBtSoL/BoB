// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../model/songinfo';


// Component decorator
@Component({
    selector: 'playlist-current',
    template: `


    <div class="card">
        <div class="card-block">
        <h4 class="card-title">Current played {{comment.title}}</h4>
        <p class="card-text">Current played {{comment.genre}} small card.</p>
        </div>
        <div class="card-footer">
        <small class="text-muted">Last updated 3 mins ago
        </small>
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

    // Constructor
    constructor(
    ) { }


}
