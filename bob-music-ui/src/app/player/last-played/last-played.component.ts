import { Component, OnInit, Input } from '@angular/core';
import { Songinfo } from 'src/app/Model/songinfo';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-last-played',
  templateUrl: './last-played.component.html',
  styleUrls: ['./last-played.component.scss']
})
export class LastPlayedComponent implements OnInit {

  @Input() songinfo: Songinfo;
  constructor(public musicService: RestService) { }

  ngOnInit() {
  }

  public play() {
    this.musicService.setMasterPlayerPlayPlaylistId(this.songinfo.playlist_index).subscribe();
  }

}
