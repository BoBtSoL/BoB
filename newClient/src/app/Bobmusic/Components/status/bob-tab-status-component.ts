// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../../Services/music.service';

import { Playerstatus } from '../../Model/playerstatus';
import { Player } from '../../Model/player';
import { Songinfo } from '../../Model/songinfo';


@Component({
    selector: 'bob-tab-status-component',
    templateUrl: './bob-tab-status-component.html',
    providers: [MusicService]
})
export class BobTabStatusComponent implements OnInit {

    serverStatus = 'Online';
    players: Player[];
    masterPlayerStatus: Playerstatus;
    slavePlayerStatus: Playerstatus;

    constructor(
        private musicService: MusicService
    ) { }

    public onRefreshStatus() {
        this.musicService.getAllPlayers().then(result => {
            this.players = result;
        });
        this.musicService.getMasterPlayer().then(result => {
        this.masterPlayerStatus = result;
        });
        this.musicService.getSlavePlayer().then(result => {
            this.slavePlayerStatus = result;
        });
    }

    ngOnInit() {
        // warten
    }
}
