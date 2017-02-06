// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../services/music.service';

import { Playerstatus } from '../model/playerstatus';
import { Songinfo } from '../model/Songinfo';


@Component({
    selector: 'bob-volume-slave-component',
    template: `
    <br>
<div class="card text-center">
<div class="card-header">
    Vol.
  </div>
  <div class="card-block" *ngIf="ready==true">
        <md-slider vertical [max]="max"
        [min]="min" step="2" value="value" (change)="clicked(event)" (onSliderChange)=clicked(event) 
        (ngModelChange)="myModel=$event" [ngModel]="myModel"></md-slider>
  </div>
    <div class="card-block" *ngIf="ready==false">
        <md-slider disabled=true></md-slider>
  </div>
</div>


    `,
    providers: [MusicService]
})
export class BobVolumeSlaveControl implements OnInit, OnChanges {
    @Input() isMaster: boolean;

    max = 100;
    min = 0;
    myModel = 0;
    ready = false;

    @Output() value = 0;

    playerStatus: Playerstatus;

    clicked(event) {
        console.warn('wow. Clicked fired ' + this.myModel);
        this.musicService.setMasterPlayerVolume(this.myModel);
    }

    constructor(
        private musicService: MusicService
    ) { }

    isMasterPlayer() {
        if (this.isMaster != null) {
            return this.isMaster;
        }
    }

    onSliderChange() {
        console.warn('changed om sliderchange!');
    }

    setValuesCorrect() {
        if (this.playerStatus != null) {
            this.value = this.playerStatus.mixer_volume;
            this.myModel =this.playerStatus.mixer_volume;
            console.warn('set value!');
            this.ready=true;
        }
    }

    ngOnInit() {
        if (this.isMaster === true) {
            this.musicService.getMasterPlayer().then(playerStatus => { this.playerStatus = playerStatus; this.setValuesCorrect(); });
        } else {
            //this.musicService.getSlave().then(serverstatus => this.model = serverstatus);
        }


        // this.musicService.startPlay().then(serverrespone => this.serverrespone = serverrespone);

        // Load comments
        // this.submitMusic();
    }

    ngOnChanges() {
        console.warn('changed!');
    }



}
