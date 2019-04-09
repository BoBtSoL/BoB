import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { SongSearchResult } from '../model/songs-search-result';
import { Songinfo } from '../Model/songinfo';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  titel: string;
  searchResult: SongSearchResult;
  searching = false;
  status: number;
  resultListSplit: Songinfo[];
  noResultFoundText: string;


  constructor(public musicService: RestService) { }


  onSearch() {
    this.searching = true;

    this.musicService.performeSongSearch(this.titel).subscribe((result) => {
      this.searchResult = result;
      this.showResults();
      this.searching = false;
    });

  }

  showResults() {
    if (this.searchResult == null || this.searchResult.count === 0) {
      this.noResultFoundText = 'Keine Treffer: ' + this.titel;
      // console.warn('war wohl nix!');
    } else {
      // console.warn('wuhu, found ' + this.searchResult.count);
      this.resultListSplit = this.searchResult.titles_loop;
    }
  }


  callError(reason) {
    // console.warn('war wohl nix' + reason);
    this.status = 2;
  }

  callSuccess() {
    this.status = 1;
  }

  resultsFound() {
    let found = false;
    if (this.searchResult == null) {
      found = false;
    } else {
      if (this.searchResult.titles_loop != null) {
        if (this.searchResult.titles_loop.length > 0) {
          found = true;
        }
      }
    }
    return found;
  }


  ngOnInit() {
  }

}
