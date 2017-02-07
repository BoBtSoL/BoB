// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../services/music.service';

import { Playerstatus } from '../model/playerstatus';
import { Songinfo } from '../model/Songinfo';


@Component({
    selector: 'bob-settings-component',
    template: `
    <br>
     <div class="col-sm-12">
        <h4>Randomplay</h4>
        <button md-raised-button (click)="startRandomPlay()">Start Randomplay</button>
    </div>


    `,
    providers: [MusicService]
})
export class BobSettingsComponent implements OnInit, OnChanges {


    constructor(
        private musicService: MusicService
    ) { }

    startRandomPlay() {
        this.musicService.startPlayRanom();
    }

    ngOnInit() {
    }

    ngOnChanges() {
        //
    }



}
