// Imports
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Songinfo } from '../model/songinfo';


// Component decorator
@Component({
    selector: 'playlist-last',
    template: `

  <div class="col-sm-6">
    <div class="card">
        <div class="card-block">
        <h4 class="card-title">Last played {{comment.title}}</h4>
        <p class="card-text">Last played {{comment.genre}} small card.</p>
        </div>
        <div class="card-footer">
        <small class="text-muted">Last updated 3 mins ago
        </small>
        </div>
    </div>
  </div>
    

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
