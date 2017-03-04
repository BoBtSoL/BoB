// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../Services/music.service';

import { Playerstatus } from '../Model/playerstatus';
import { Songinfo } from '../Model/songinfo';


@Component({
    selector: 'bob-volume-component',
    template: `
    <br>
<div class="card text-center transparend-card">
<div class="card-header">
    Vol. Master
  </div>
  <div class="card-block" *ngIf="ready==true">
        <md-slider vertical [max]="max"
        [min]="min" step="2" value="value" (change)="clicked(event)" (onSliderChange)=clicked(event) 
        (ngModelChange)="myModel=$event" [ngModel]="myModel"></md-slider>
  </div>
    <div class="card-block" *ngIf="ready==false">
        <md-slider vertical disabled=true></md-slider>
  </div>
      <div class="card-footer" *ngIf="ready==true">
        <small class="text-muted">Player online</small>
    </div>
    <div class="card-footer" *ngIf="ready==false">
        <small class="text-muted">Player offline</small>
    </div>
</div>


    `,
    providers: [MusicService]
})
export class BobVolumeControl implements OnInit, OnChanges {
    @Input() isMaster: boolean;

    max = 100;
    min = 0;
    myModel = 0;
    ready = false;

    @Output() value = 0;

    playerStatus: Playerstatus;

    clicked(event) {
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

    setValuesCorrect(playerStatus: Playerstatus) {
        if (this.playerStatus != null) {
            this.value = this.playerStatus.mixer_volume;
            this.myModel = this.playerStatus.mixer_volume;
            console.warn('set value in Master! ' + this.value + ' wow ' + this.myModel);
            this.ready = true;
        }
    }

    ngOnInit() {
        if (this.isMaster === true) {
            this.musicService.getMasterPlayer().then(playerStatus => {
                this.playerStatus = playerStatus;
                this.setValuesCorrect(playerStatus);
            });
        }
    }

    ngOnChanges() {
        console.warn('changed!');
    }



}
