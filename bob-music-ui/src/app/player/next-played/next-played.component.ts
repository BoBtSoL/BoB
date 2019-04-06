import { Component, OnInit, Input } from '@angular/core';
import { Songinfo } from 'src/app/Model/songinfo';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-next-played',
  templateUrl: './next-played.component.html',
  styleUrls: ['./next-played.component.scss']
})
export class NextPlayedComponent implements OnInit {

  @Input() songinfo: Songinfo;
  constructor(public musicService: RestService) { }

  ngOnInit() {
  }

  public play() {
    this.musicService.setMasterPlayerPlayPlaylistId(this.songinfo.playlist_index).subscribe();
  }

}
