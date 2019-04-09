import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Favorite } from '../model/favorite';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  constructor(public musicService: RestService) { }

  favorites: Favorite[];

  loadFavorites() {
    this.musicService.getFavorites().subscribe(data => {
      if (data != null && data.count != null && data.count > 0) {
        this.favorites = data.loop_loop;
      }
    });
  }

  ngOnInit() {
    this.musicService.getFavorites().subscribe(data => {
      if (data != null && data.count != null && data.count > 0) {
        this.favorites = data.loop_loop;
      }
    });
  }

}
