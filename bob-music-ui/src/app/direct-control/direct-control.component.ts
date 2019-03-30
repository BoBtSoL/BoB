import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { Status } from '../model/status';
import { FadingModel } from '../model/fading-model';
import { FadingStatus } from '../model/fading-status';
import { ColorModel } from '../model/color-model';

@Component({
  selector: 'app-direct-control',
  templateUrl: './direct-control.component.html',
  styleUrls: ['./direct-control.component.scss']
})

export class DirectControlComponent implements OnInit {

  products: any = [];
  status: Status;
  redValue: number;
  greenValue: number;
  blueValue: number;
  color: string;
  fadingStatus: FadingStatus;

  constructor(public rest: RestService) {
    this.color = 'rgb(0,0,0)';
  }

  startParty() {
    console.warn('Start Party');
    this.rest.startParty(this.status).subscribe((result) => {
      this.status = result;
    });
  }
  startFading() {
    console.warn('Start Fading');
    let fadingModel: FadingModel;
    fadingModel = new FadingModel();
    fadingModel.startColors = {red: 0, green: 0, blue: 255};
    fadingModel.toColors = {red: 0, green: 100, blue: 0 };
    fadingModel.seconds = 15;

    this.rest.startFading(fadingModel).subscribe((result) => {
      this.fadingStatus = result;
    });
  }

  getColor() {
    return this.color;
  }

  stopParty() {
    console.warn('Stop Party');
    this.rest.stopParty(this.status).subscribe((result) => {
      this.status = result;
    });
  }

  ngOnInit() {
    this.redValue = 0;
    this.greenValue = 0;
    this.blueValue = 0;
    this.getStatus();
  }

  onSliderChange(event) {
    console.warn('wow!');
      let colorModel: ColorModel;
      colorModel = new ColorModel();
      colorModel.red = this.redValue.toString();
      colorModel.blue = this.blueValue.toString();
      colorModel.green = this.greenValue.toString();

      this.rest.updateColors(colorModel).subscribe((result) => {
        this.status = result;
        this.updateColor();
    });

  }

  onChangingBlue(event) {
    console.warn('during change' + event.value);

    let colorModel: ColorModel;
    colorModel = new ColorModel();
    colorModel.red = this.redValue.toString();
    colorModel.blue = event.value;
    colorModel.green = this.greenValue.toString();
      this.rest.updateColors(colorModel).subscribe((result) => {
        console.log(result);
      });
  }

  onChangingGreen(event) {
    console.warn('during change' + event.value);
    let colorModel: ColorModel;
    colorModel = new ColorModel();
    colorModel.red = this.redValue.toString();
    colorModel.blue = this.blueValue.toString();
    colorModel.green = event.value;
      this.rest.updateColors(colorModel).subscribe((result) => {
        console.log(result);
      });
  }

  onChangingRed(event) {
    console.warn('during change' + event.value);
    let colorModel: ColorModel;
    colorModel = new ColorModel();
    colorModel.red = event.value;
    colorModel.blue = this.blueValue.toString();
    colorModel.green = this.greenValue.toString();
      this.rest.updateColors(colorModel).subscribe((result) => {
        console.log(result);
      });
  }

  getStatus() {
    this.rest.getStatus().subscribe((data: Status) => {
      this.status = data;
      this.redValue = Number(data.colors.red);
      this.greenValue = Number(data.colors.green);
      this.blueValue = Number(data.colors.blue);
      this.updateColor();
    });
  }


  updateColor() {
    const red = (Number(this.status.colors.red));
    const green = (Number(this.status.colors.green));
    const blue = (Number(this.status.colors.blue));

    const redVal = red / (red + green + blue);

    // tslint:disable-next-line:max-line-length
    let brightness = ((Number(this.status.colors.red) / 255.0)) + ((Number(this.status.colors.green) / 255)) + ((Number(this.status.colors.blue) / 255.0));
    brightness = this.round(brightness, 1 );
    this.color = 'rgba(' + this.status.colors.red + ',' + this.status.colors.green + ',' + this.status.colors.blue + ',' + brightness + ')';
  }

  round(number, precision) {
    const factor = Math.pow(10, precision);
    const tempNumber = number * factor;
    const roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }
}
