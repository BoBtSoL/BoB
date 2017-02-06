/* * * ./app/comments/components/comment-form.component.ts * * */
// Imports
import { Component, EventEmitter, Input, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

import { CommentBoxComponent } from './comment-box.component';
import { MusicService } from '../services/music.service';
import { EmitterService } from '../../emitter.service';
import { Serverstatus } from '../model/serverstatus';
import { Songinfo } from '../model/Songinfo';

// Component decorator
@Component({
    selector: 'info-form',
    template: `
    <div *ngIf="isOnline()==true">
        <h2 style="text-align: center;">BoB Music Control</h2>

        <div class="btn-group">
            <button class="btn btn-inverse" (click)="prev()"><span class="glyphicon glyphicon-fast-backward"></span></button>
            <button *ngIf="isPlaying()==false"class="btn btn-inverse" (click)="play()"><span class="glyphicon glyphicon-play"></span></button>
            <button *ngIf="isPlaying()==true" class="btn btn-inverse" (click)="pause()"><span class="glyphicon glyphicon-pause"></span></button>
            <button class="btn btn-inverse" (click)="next()"><span class="glyphicon glyphicon-fast-forward"></span></button>
        </div>
        

        <h4>{{model.mode}}</h4>
    </div>

    <div>
        <h4>Playlist oder so...</h4>
        <!--<div class="row"> -->
            <div class="col-sm-12">
                <comment-box [editId]="editId" [listId]="listId" *ngFor="let comment of songInfoArr" [comment]="comment"></comment-box>
            </div>
       <!-- </div> -->
    </div>

    <div *ngIf="isOnline()==false">
        <h1>Server offline oder IP ist banane!</h1>
    </div>
    `,
    providers: [MusicService]
})
// Component class
export class InfoFormComponent implements OnChanges, OnInit {
    model: Serverstatus;
    serverrespone: Serverstatus;

    songInfoArr: Songinfo[]
    // Constructor with injected service

    constructor(
        private musicService: MusicService
    ) { }


    isOnline() {
        if (this.model == null) {
            return false;
        } else {
            return true;
        }
    }

    isPlaying() {
        if (this.model == null) {
            return false;
        }
        if ('play' === this.model.mode) {
            return true;
        } else {
            return false;
        }
    }

    next() {
        this.musicService.next().then(serverstatus => this.model = serverstatus);
    }


    prev() {
        this.musicService.prev().then(serverstatus => this.model = serverstatus);
    }

    play() {
        this.musicService.startPlay().then(serverstatus => this.model = serverstatus);
    }

    pause() {
        this.musicService.startPause().then(serverstatus => this.model = serverstatus);
    }

    submitMusic() {
        let musicOperation: Observable<Serverstatus>;

        musicOperation = this.musicService.getStatus();

        // Variable to hold a reference of addComment/updateComment
        // Subscribe to observable
        musicOperation.subscribe(
            serverstatus => this.model = serverstatus, // Bind to view
            err => {
                // Log errors if any
                console.log(err);
            });
    }

    ngOnInit() {

        this.musicService.getStatus2().then(serverstatus => this.model = serverstatus);
        this.musicService.getPlaylist().then(result => this.songInfoArr = result);

        // this.musicService.startPlay().then(serverrespone => this.serverrespone = serverrespone);

        // Load comments
        // this.submitMusic();
    }

    ngOnChanges() {


        // Listen to the 'edit'emitted event so as populate the model
        // with the event payload
        // EmitterService.get(this.editId).subscribe((comment: Comment) => {
        //     this.model = comment;
        //     this.editing = true;
        // });
    }
}
