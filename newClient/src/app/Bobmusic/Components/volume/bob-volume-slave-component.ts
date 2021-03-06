// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MusicService } from '../../Services/music.service';

import { Playerstatus } from '../../Model/playerstatus';
import { Songinfo } from '../../Model/songinfo';


@Component({
    selector: 'bob-volume-slave-component',
    template: `
            <br>
        <div class="card text-center transparend-card">
        <div class="card-header">
            Vol. Slave
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


    `
})
export class BobVolumeSlaveControl implements OnInit, OnChanges {
    @Input() isMaster: boolean;
    subscription: Subscription;

    max = 100;
    min = 0;
    myModel = 0;
    ready = false;

    @Output() value = 0;

    playerStatus: Playerstatus;

    clicked(event) {
        this.musicService.setSlavePlayerVolume(this.myModel);
    }

    constructor(
        private musicService: MusicService
    ) {
        this.subscription = this.musicService.slaveVolumeChanged$.subscribe(
            mission => {
                this.reInit();
            });
     }

    isMasterPlayer() {
        if (this.isMaster != null) {
            return this.isMaster;
        }
    }

    onSliderChange() {
        // //console.warn('changed om sliderchange!');
    }

    setValuesCorrect() {
        if (this.playerStatus != null && this.playerStatus.mixer_volume != null) {
            this.value = this.playerStatus.mixer_volume;
            this.myModel = this.playerStatus.mixer_volume;
            //console.warn('set value!');
            this.ready = true;
        }
    }

    ngOnInit() {
        this.musicService.getSlavePlayer().then(playerStatus => { this.playerStatus = playerStatus; this.setValuesCorrect(); });
    }

    reInit() {
        this.musicService.getSlavePlayer().then(playerStatus => { this.playerStatus = playerStatus; this.setValuesCorrect(); });
    }

    ngOnChanges() {
        // nix
    }



}
