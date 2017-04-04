// Imports
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { MusicService } from '../../Services/music.service';

import { Playerstatus } from '../../Model/playerstatus';
import { Songinfo } from '../../Model/songinfo';
import { Serveronline } from '../../Model/serveronline';
import { SongSearchResult } from '../../Model/songs-search-result';

@Component({
    selector: 'bob-tab-search-component',
    templateUrl: './bob-tab-search-component.html',
    providers: [MusicService]
})
export class BobTabSearchComponent implements OnInit, OnChanges {

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


