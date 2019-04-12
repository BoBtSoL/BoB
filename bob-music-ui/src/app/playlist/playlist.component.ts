import { Component, OnInit } from '@angular/core';
import { PlaylistsLoop } from '../model/playlistsloop';
import { PlaylistsLoopRoot } from '../model/playlistslooproot';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  playlistroot: PlaylistsLoopRoot;
  playlists: PlaylistsLoop[];

  constructor(public musicService: RestService) { }



  ngOnInit() {
    // TODO playlist laden

  }

}
