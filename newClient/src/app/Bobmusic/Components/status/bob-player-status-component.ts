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

    getSyncMaster() {
        if (this.playerstatus != null && this.playerstatus.sync_master != null) {
            return this.playerstatus.sync_master;
        } else {
            return '';
        }
    }

    getSyncSlaves() {
        if (this.playerstatus != null && this.playerstatus.sync_slaves != null) {
            return this.playerstatus.sync_slaves;
        } else {
            return '';
        }
    }

}
