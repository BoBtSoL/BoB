import { Component, OnInit, Input } from '@angular/core';
import { Songinfo } from 'src/app/Model/songinfo';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-currently-played',
  templateUrl: './currently-played.component.html',
  styleUrls: ['./currently-played.component.scss']
})
export class CurrentlyPlayedComponent implements OnInit {

  @Input() songinfo: Songinfo;
  constructor(public musicService: RestService) { }

  ngOnInit() {
  }

  public getAlbum(): string {


    if (this.songinfo.album === null) {
      return '';
    } else {
      return '(' + this.songinfo.album + ')';
    }
  }

  public play() {
    this.musicService.setMasterPlayerPlayPlaylistId(this.songinfo.playlist_index).subscribe();
  }


}
