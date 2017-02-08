import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { BobMainComponent } from './Components/bobmain.component';
import { PlaylistInfoComponent } from './Components/playlistinfo.component';
import { BobMasterComponent } from './Components/bob-master-component';
import { BobVolumeControl } from './Components/bob-volume-component';
import { BobVolumeSlaveControl } from './Components/bob-volume-slave-component';
import { PlayListLastPlayed } from './Components/playlist-lastplayed.component';
import { PlaylistCurrentPlayed } from './Components/playlist-currentplayed.components';
import { BobSettingsComponent } from './Components/bob-settings-component';
import { BobSearchComponent } from './Components/bob-search-component';
import { ResultInfoComponent } from './Components/resultinfo.component';

import { MusicService } from './services/music.service';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    MaterialModule.forRoot(),
  ],
  declarations: [
    BobMasterComponent,
    BobMainComponent,
    PlaylistInfoComponent,
    BobVolumeControl,
    BobVolumeSlaveControl,
    PlayListLastPlayed,
    PlaylistCurrentPlayed,
    BobSettingsComponent,
    BobSearchComponent,
    ResultInfoComponent
  ],

  providers: [
    MusicService
  ],

  exports: [
    BobMasterComponent,
    BobMainComponent,
    PlaylistInfoComponent,
    BobVolumeControl,
    BobVolumeSlaveControl,
    PlayListLastPlayed,
    PlaylistCurrentPlayed,
    BobSettingsComponent,
    BobSearchComponent,
    ResultInfoComponent
  ]

})
export class BobMusicModule {
}

