import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Playerstatus } from './../Model/playerstatus';
import { Observable, Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-volume-master',
  templateUrl: './volume-master.component.html',
  styleUrls: ['./volume-master.component.scss']
})
export class VolumeMasterComponent implements OnInit {

  sliderVal: number;
  playerStatus: Playerstatus;
  ready: boolean;
  subscription: Subscription;

  constructor(public rest: RestService) {
    this.ready = false;
    this.subscription = this.rest.masterVolumeChanged$.subscribe(
      mission => {
          this.reInit();
      });

  }

  ngOnInit() {
    this.rest.getMasterPlayer().subscribe((playerStatus) => {
      if (playerStatus.power != null) {
        this.playerStatus = playerStatus;
        this.setValuesCorrect();
      }
    });
  }


  reInit() {
    this.rest.getMasterPlayer().subscribe((playerStatus) => {
      this.playerStatus = playerStatus;
      this.setValuesCorrect();
    });
}

  setValuesCorrect() {
    if (this.playerStatus != null) {
        this.sliderVal = this.playerStatus.mixer_volume;
        this.ready = true;
    }
}

  onSliderChange(event) {
    this.rest.setMasterPlayerVolume(this.sliderVal).subscribe((result) => {
    });
  }

  onChanging(event) {

  }

}
