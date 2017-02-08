// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../services/music.service';

import { Playerstatus } from '../model/playerstatus';
import { Songinfo } from '../model/songinfo';
import { Serveronline } from '../model/serveronline';

@Component({
    selector: 'bob-settings-component',
    template: `
    <br>


 <div class="col-sm-12">
    <md-card>
    <md-card-header>
        <md-card-title>Server Settings</md-card-title>
    </md-card-header>
    <md-card-content>
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
            
    </md-card-content>
    <md-card-actions>
        <button md-button (click)="onTestConfig()">TEST</button>
        <button md-button>SAVE</button>
    </md-card-actions>

    </md-card>
<br>

 <md-card>
    <md-card-header>
        <md-card-title>Randomplay</md-card-title>
    </md-card-header>
    <md-card-content>
           <p>Zufallsmix starten</p>
           <p>Startet einen mix mit allem</p>
    </md-card-content>
    <md-card-actions>
        <button md-button (click)="startRandomPlay()">START</button>
    </md-card-actions>
    </md-card>
    <br>

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


