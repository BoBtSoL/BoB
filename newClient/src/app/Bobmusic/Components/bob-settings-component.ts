// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../Services/music.service';

import { Playerstatus } from '../Model/playerstatus';
import { Songinfo } from '../Model/songinfo';
import { Serveronline } from '../Model/serveronline';

@Component({
    selector: 'bob-settings-component',
    template: `
    <br>
     <div class="col-sm-12">

        <div class="card transparend-card">
            <div class="card-header">Zufallsmix:</div>
            <div class="card-block">
                <p class="card-text">
                Zufallsmix starten
                </p>
            </div>
            <div class="card-footer">
                <button class="btn btn-outline-danger" type="button" (click)="startRandomPlay()">Alles</button>
            </div>
        </div>

        <br>

         <div class="card transparend-card">
            <div class="card-header">Servereinstellungen:</div>
            <div class="card-block">

            <md-input-container>
            <input md-input placeholder="Server IP" [(ngModel)]="serverIp">
            </md-input-container>

            <md-input-container>
            <input md-input placeholder="Server Port" [(ngModel)]="serverPort">
            </md-input-container>
            
            <div *ngIf="status==2">
                <p><i class="material-icons">warning</i>
                Test nicht erfolgreich</p></div>
            <div *ngIf="status==1">
            <p> <i class="material-icons">done</i>
            Test erfolgreich</p></div>


            </div>
            <div class="card-footer">
            <button class="btn btn-outline-danger" type="button" (click)="onTestConfig()">TEST</button>
            <button class="btn btn-outline-danger" type="button" (click)="onSave()">TEST</button>
            </div>
        </div>

</div>


    `,
    providers: [MusicService]
})
export class BobSettingsComponent implements OnInit, OnChanges {

    serverIp: string;
    serverPort: number;

    status: number;

    serverRespone: Serveronline;

    constructor(
        private musicService: MusicService
    ) { this.status = 0; }

    startRandomPlay() {
        this.musicService.startPlayRanom();
    }

    ngOnInit() {
        this.status = 0;
        this.serverIp = this.musicService.baseServerUrl;
        this.serverPort = this.musicService.baseServerPort;
    }

    ngOnChanges() {
        //
    }

    onTestConfig() {
        this.musicService.testUrl(this.serverIp, this.serverPort).then(resp => {
            this.serverRespone = resp; this.callSuccess();
        })
            .catch(res => this.callError(res));
    }

    onSave() {
        this.musicService.setBaseUrl(this.serverIp, this.serverPort);
    }

    callError(reason) {
        console.warn('war wohl nix' + reason);
        this.status = 2;

    }

    callSuccess() {
        this.status = 1;
    }

}


