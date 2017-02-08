// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../services/music.service';

import { Playerstatus } from '../model/playerstatus';
import { Songinfo } from '../model/songinfo';
import { Serveronline } from '../model/serveronline';
import { SongSearchResult } from '../Model/songs-search-result';

@Component({
    selector: 'bob-search-component',
    template: `
    <br>


 <div class="col-sm-12">
    <md-card>
    <md-card-header>
        <md-card-title>Suche</md-card-title>
    </md-card-header>
    <md-card-content>
            <md-input-container>
            <input md-input placeholder="Band:" [(ngModel)]="band">
            </md-input-container>

            <md-input-container>
            <input md-input placeholder="Titel:" [(ngModel)]="titel">
            </md-input-container>
            
            <div *ngIf="status==2">
                <p><i class="material-icons">warning</i>
                Test nicht erfolgreich</p></div>
            <div *ngIf="status==1">
            <p> <i class="material-icons">done</i>
            Test erfolgreich</p></div>

            <h4>total: {{searchResult?.count}} </h4>
            
    </md-card-content>
    <md-card-actions>
        <button md-button (click)="onSearch()">Suchen</button>
    </md-card-actions>

    </md-card>
<br>


    <resulinfo-component *ngFor="let comment of resultListSplit" [comment]="comment"></resulinfo-component>

</div>

    `,
    providers: [MusicService]
})
export class BobSearchComponent implements OnInit, OnChanges {

    band: string;
    titel: string;
    searchResult: SongSearchResult;

    status: number;

    serverRespone: Serveronline;

    resultListSplit: Songinfo[];

    constructor(
        private musicService: MusicService
    ) { this.status = 0; }

    startRandomPlay() {
        this.musicService.startPlayRanom();
    }

    ngOnInit() {
        this.status = 0;
    }

    ngOnChanges() {
        //
    }

    onSearch() {
        this.musicService.performeSongSearch(this.titel).then(result => {
            this.searchResult = result;
            this.showResults();
        });

    }

    showResults() {
        if (this.searchResult == null) {
            console.warn('war wohl nix!');
        } else {
            console.warn('wuhu, found ' + this.searchResult.count);
            this.resultListSplit = this.searchResult.titles_loop;
        }
    }

    callError(reason) {
        console.warn('war wohl nix' + reason);
        this.status = 2;
    }

    callSuccess() {
        this.status = 1;
    }

}


