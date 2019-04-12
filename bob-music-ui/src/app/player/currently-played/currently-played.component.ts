import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Songinfo } from 'src/app/Model/songinfo';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-currently-played',
  templateUrl: './currently-played.component.html',
  styleUrls: ['./currently-played.component.scss']
})
export class CurrentlyPlayedComponent implements OnInit, OnChanges {

  @Input() songinfo: Songinfo;
  formattedString: string;
  constructor(public musicService: RestService) {
    this.formattedString = 'Intialized';
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.formattedString = '';
    if (this.songinfo.artist !== null && this.songinfo.artist !== undefined) {
      this.formattedString = this.songinfo.artist + ' - ';
    }
    this.formattedString = this.formattedString + this.songinfo.title;

    if (!(this.songinfo.album === null || this.songinfo.album === undefined)) {
      this.formattedString = this.formattedString + ' (' + this.songinfo.album + ')';
    }
  }

  public play() {
    this.musicService.setMasterPlayerPlayPlaylistId(this.songinfo.playlist_index).subscribe();
  }


}
