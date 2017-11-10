// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../../Services/music.service';

import { Playerstatus } from '../../Model/playerstatus';
import { Songinfo } from '../../Model/songinfo';
import { Serveronline } from '../../Model/serveronline';

@Component({
    selector: 'bob-settings-component',
    templateUrl: './bob-tab-settings-component.html',
    providers: [MusicService]
})
export class BobTabSettingsComponent implements OnInit, OnChanges {

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

    onResetConfig(){
        this.musicService.resetServer();
    }

    onSave() {
        this.musicService.setBaseUrl(this.serverIp, this.serverPort);
    }

    callError(reason) {
        //console.warn('war wohl nix' + reason);
        this.status = 2;

    }

    callSuccess() {
        this.status = 1;
    }

}


