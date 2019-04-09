import { Component, OnInit, Input } from '@angular/core';
import { Favorite } from 'src/app/model/favorite';
import { RestService } from 'src/app/rest.service';

@Component({
  selector: 'app-favorite-detail',
  templateUrl: './favorite-detail.component.html',
  styleUrls: ['./favorite-detail.component.scss']
})
export class FavoriteDetailComponent implements OnInit {

  @Input() favorite: Favorite;

  addedStatus: number;

  constructor(public musicService: RestService) {
    this.addedStatus = 0;
  }


  addToPlaylist() {
    const realId = this.favorite.id.substr(this.favorite.id.lastIndexOf('.') + 1);
    this.musicService.addFavoriteToPlaylist(realId).subscribe(ret => {
      this.musicService.playlistChanged('show');
    });
  }

  playNow() {
    const realId = this.favorite.id.substr(this.favorite.id.lastIndexOf('.') + 1);
    this.musicService.playFavoriteNow(realId).subscribe(ret => {
      this.musicService.playlistChanged('show');
    });
  }

  ngOnInit() {

  }

}
