import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MatTabsModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatProgressBarModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatSliderModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material';
import { VolumeMasterComponent } from './volume-master/volume-master.component';
import { VolumeSlaveComponent } from './volume-slave/volume-slave.component';
import { LayoutComponent } from './layout/layout.component';
import { PlayerComponent } from './player/player.component';
import { SettingsComponent } from './settings/settings.component';
import { SearchComponent } from './search/search.component';
import { LastPlayedComponent } from './player/last-played/last-played.component';
import { CurrentlyPlayedComponent } from './player/currently-played/currently-played.component';
import { NextPlayedComponent } from './player/next-played/next-played.component';
import { ResultComponent } from './search/result/result.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { FavoriteDetailComponent } from './favorite/favorite-detail/favorite-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    VolumeMasterComponent,
    VolumeSlaveComponent,
    LayoutComponent,
    PlayerComponent,
    SettingsComponent,
    SearchComponent,
    LastPlayedComponent,
    CurrentlyPlayedComponent,
    NextPlayedComponent,
    ResultComponent,
    FavoriteComponent,
    FavoriteDetailComponent
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
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
