import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  status: number;

  constructor(public musicService: RestService) {
    this.status = 0;
  }



  resetConfig() {
    this.musicService.resetServer().subscribe();
  }

  testConfig() {
    this.musicService.getStatus().subscribe((serverstatus) => {
      if (serverstatus != null && serverstatus.power != null && serverstatus.power > 0) {
        this.status = 1;
      } else {
        this.status = 2;
      }
    });
  }
  ngOnInit() {
  }

}
