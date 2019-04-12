import { Component, OnInit } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Playerstatus } from './../Model/playerstatus';
import { Songinfo } from './../Model/songinfo';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  playListSubscription: Subscription;
  playerStatusSubscription: Subscription;

  model: Playerstatus;
  songInfoArr: Songinfo[];
  lastPlayed: Songinfo[];
  currentplay: Songinfo[];
  currentplay_single: Songinfo;
  nextToPlay: Songinfo[];
  working: boolean;
  progress: number;
  progressString: string;
  guid: string;
  isMusicFromhandy: boolean;

  lastplayedToShow = 3;
  connection;


  constructor(public musicService: RestService) {
    this.working = false;
    this.isMusicFromhandy = false;
    this.playListSubscription = this.musicService.playlistChange$.subscribe(
      change => {
        if (change === 'show') {
          this.working = true;
        } else if (change === 'reload') {
          this.musicService.getStatus().subscribe((serverstatus) => {
            this.model = serverstatus;
            this.recalculatePlaylist(true);
          });
        } else {
          this.working = false;
        }
      });

    this.playerStatusSubscription = this.musicService.playerStatusChange$.subscribe(
      newstatus => {
        this.checkForChanges(newstatus);
        this.recalculatePlaylist(true);
      }
    );
  }

  intVal(n: number | string): number {
    return typeof n === 'number' ? n : parseInt(n, 10);
  }

  isNumeric(n: any): n is number | string {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  checkForChanges(playerstatus: Playerstatus) {
    // console.warn('in checkForChanges');
    let changed = false;
    if (this.model == null) {
      this.model = playerstatus;
      changed = true;
      // console.warn('Changed ist true.');
    }

    if (this.model != null && changed === false) {
      if (playerstatus != null) {
        const currIndex = Number(this.model.playlist_cur_index);
        const newIndex = Number(playerstatus.playlist_cur_index);

        const currTracks = Number(this.model.playlist_tracks);
        const newTracks = Number(playerstatus.playlist_tracks);
        if (currIndex !== newIndex || currTracks !== newTracks) {
          changed = true;
          // console.warn('Index hat sich verschoben, change ist ebenfalls true');
        }
      }
    }

    this.model = playerstatus;
    this.recalculatePlaylist(changed);
  }

  recreatePlaylistForReal(newSongInfo: Songinfo[], forceRecreate: boolean) {
    // console.warn('in real recalculation');
    let changedLocal: boolean;

    changedLocal = false;

    // Erkennen von Änderungen für Performance...
    if (this.currentplay != null && this.currentplay[0] != null && forceRecreate === false) {
      let newNowPlaying: Songinfo;
      for (const currSongInfo of newSongInfo) {
        if (this.intVal(currSongInfo.playlist_index) === this.intVal(this.model.playlist_cur_index)) {
          newNowPlaying = currSongInfo;
        }
      }

      // const sliceFrom = Number(this.model.playlist_cur_index);
      // const sliceTo = Number(this.model.playlist_cur_index) + 1;

      // newNowPlaying = newSongInfo.slice(sliceFrom, sliceTo)[0];
      if (newNowPlaying != null) {
        if (newNowPlaying.id == this.currentplay[0].id) {
          changedLocal = false;
        } else {
          changedLocal = true;
        }
      }
    }

    if (forceRecreate === true || changedLocal === true) {

      const currIndex = this.intVal(this.model.playlist_cur_index);
      // this.nextToPlay = [];
      if (currIndex === 0) {
        // console.warn('Index 0, set lastplayed to null');
        this.currentplay = newSongInfo.slice(0, 1);
        this.currentplay_single = newSongInfo.slice(0, 1)[0];
        this.lastPlayed = [];
        this.nextToPlay = newSongInfo.slice(currIndex + 1, newSongInfo.length);
      } else {

        let tmpLastPlayed: Songinfo[];
        let tmpCurrentPlay: Songinfo[];
        let tmpNextToPlay: Songinfo[];

        tmpLastPlayed = [];
        tmpCurrentPlay = [];
        tmpNextToPlay = [];

        for (const currSongInfo of newSongInfo) {
          if (this.intVal(currSongInfo.playlist_index) < this.intVal(this.model.playlist_cur_index)) {
            tmpLastPlayed.push(currSongInfo);
          }

          if (this.intVal(currSongInfo.playlist_index) === this.intVal(this.model.playlist_cur_index)) {
            tmpCurrentPlay.push(currSongInfo);
          }

          if (this.intVal(currSongInfo.playlist_index) > this.intVal(this.model.playlist_cur_index)) {
            tmpNextToPlay.push(currSongInfo);
          }
        }

        this.lastPlayed = tmpLastPlayed;
        this.currentplay = tmpCurrentPlay;
        this.nextToPlay = tmpNextToPlay;

        this.currentplay_single = this.currentplay[0];
      }

    }

    // progress berechnen
    if (this.model != null && this.currentplay_single != null) {
      if (this.model.time != null && this.currentplay_single.duration != null) {
        let total: number;
        let current: number;
        // console.warn('vorm Rechnen');
        const durationString = String(this.currentplay_single.duration);
        const timeString = this.model.time;

        let durationNumber = 0;

        if (this.isNumeric(durationString)) {
            durationNumber = this.intVal(durationString);
        }

        if (durationNumber > 0) {
          this.isMusicFromhandy=false;
          total = Number(durationString.split('.')[0]);
          current = Number(timeString.toString().split('.')[0]);
          this.progress = (current / total) * 100;
          this.progress = Number(this.progress.toString().split('.')[0]);
          this.progressString = this.progress.toString();
          // console.warn('Errechnet ' + this.progress);
        } else {
          this.isMusicFromhandy=true;
          this.progress = 0;
          this.progressString = '0';
        }
      }

    }
  }

  recalculatePlaylist(foreRecreate: boolean) {
    // console.warn('in recalulate playlist');
    let currentPlaylistIndex = -1;
    if (this.model != null) {
      currentPlaylistIndex = Number(this.model.playlist_cur_index);
    }

    if (this.model != null) {
      if (currentPlaylistIndex > -1) {
        let calculateFrom = currentPlaylistIndex - this.lastplayedToShow;
        if (calculateFrom < 0) {
          calculateFrom = 0;
        }
        const calculateTo = 10;
        this.musicService.getPlaylistFromTo(calculateFrom.toString(), calculateTo.toString()).subscribe((result) => {
          this.recreatePlaylistForReal(result, foreRecreate);
        });

      } else {
        this.musicService.getPlaylistFromTo('0', '10').subscribe((result) => {
          this.recreatePlaylistForReal(result, foreRecreate);
        });
      }
    }
    this.working = false;
  }

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
    this.musicService.next().subscribe((serverstatus) => {
      this.checkForChanges(serverstatus);
    });
  }

  prev() {
    this.musicService.prev().subscribe((serverstatus) => {
      this.checkForChanges(serverstatus);
    });
  }

  play() {
    this.musicService.play().subscribe((serverstatus) => {
      this.checkForChanges(serverstatus);
    });
  }

  pause() {
    this.musicService.pause().subscribe((serverstatus) => {
      this.checkForChanges(serverstatus);
    });
  }


  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return minutes + ':' + (value - minutes * 60);
  }

  ngOnInit() {
    this.progress = 0;
    this.musicService.getStatus().subscribe((serverstatus) => {
      this.model = serverstatus;
      this.recalculatePlaylist(true);
    });

    const tasksSubscription = this.musicService.getStatusRegular().subscribe(data => {
      this.checkForChanges(data);
    });


    this.guid = this.musicService.guid;
  }

}
