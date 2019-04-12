import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Songinfo } from 'src/app/Model/songinfo';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-last-played',
  templateUrl: './last-played.component.html',
  styleUrls: ['./last-played.component.scss']
})
export class LastPlayedComponent implements OnInit, OnChanges {

  adding: boolean;
  deleting: boolean;
  formattedString: string;
  @Input() songinfo: Songinfo;
  constructor(public musicService: RestService) { }

  ngOnInit() {
    this.deleting = false;
    this.adding = false;
  }

  public getAlbum(): string {
    if (this.songinfo.album === null) {
      return '';
    } else {
      return '(' + this.songinfo.album + ')';
    }
  }

  public play() {
    this.adding = true;
    this.musicService.setMasterPlayerPlayPlaylistId(this.songinfo.playlist_index).subscribe();
  }

  public remove() {
    this.deleting = true;
    this.musicService.removeFromPlaylist(this.songinfo.playlist_index).subscribe(res => {
    });
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


}
