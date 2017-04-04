import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Player } from '../../Model/player';

// Component decorator
@Component({
    selector: 'bob-player',
    templateUrl: './bob-player-component.html',
})
// Component class
export class BobPlayerComponent {

    // Define input properties
    @Input() player: Player;

}
