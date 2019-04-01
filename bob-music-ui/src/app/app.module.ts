import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material';

import { AppComponent } from './app.component';
import { MasterComponent } from './master/master.component';

import { MatTabsModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatIconModule } from '@angular/material';

import { DirectControlComponent } from './direct-control/direct-control.component';
import { VolumeMasterComponent } from './volume-master/volume-master.component';
import { VolumeSlaveComponent } from './volume-slave/volume-slave.component';
import { LayoutComponent } from './layout/layout.component';
import { PlayerComponent } from './player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    MasterComponent,
    DirectControlComponent,
    VolumeMasterComponent,
    VolumeSlaveComponent,
    LayoutComponent,
    PlayerComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
