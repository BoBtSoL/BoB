import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Playerstatus } from '../../Model/playerstatus';

// Component decorator
@Component({
    selector: 'bob-player-status',
    templateUrl: './bob-player-status-component.html',
})
// Component class
export class BobPlayerStatusComponent {

    // Define input properties
    @Input() playerstatus: Playerstatus;

}
