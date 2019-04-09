import { Component, OnInit, Input } from '@angular/core';
import { Songinfo } from 'src/app/Model/songinfo';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  @Input() comment: Songinfo;

  addedStatus = 0;

  constructor(public musicService: RestService) { }

  getImgSrc() {
    return 'http://192.168.42.1:9000/music/' + this.comment.coverid + '/cover_96x96_p.png';
  }

  playNow() {
    this.addedStatus = 1;
    this.musicService.playNow(this.comment.id).subscribe((serverstatus) => {
      this.addedStatus = 2;
    });
  }

  addToPlaylist() {
    this.addedStatus = 1;
    this.musicService.addToPlaylist(this.comment.id).subscribe((serverstatus) => {
      this.addedStatus = 2;
    });

  }

  ngOnInit() {
  }

}
