import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { BobTabMainComponent } from './Components/main/bob-tab-main-component';
import { PlaylistInfoComponent } from './Components/playlist/playlistinfo.component';
import { BobMasterComponent } from './Components/bob-master-component';
import { BobVolumeControl } from './Components/volume/bob-volume-component';
import { BobVolumeSlaveControl } from './Components/volume/bob-volume-slave-component';
import { PlayListLastPlayed } from './Components/playlist/playlist-lastplayed.component';
import { PlaylistCurrentPlayed } from './Components/playlist/playlist-currentplayed.components';
import { BobTabSettingsComponent } from './Components/settings/bob-tab-settings-component';
import { BobTabSearchComponent } from './Components/search/bob-tab-search-component';
import { ResultInfoComponent } from './Components/search/resultinfo.component';
import { BobTabStatusComponent } from './Components/status/bob-tab-status-component';
import { BobTabPlaylistsComponent } from './Components/playlists/bob-tab-playlists-component';
import { BobPlaylistsDetailComponent } from './Components/playlists/bob-playlists-detail-component';
import { BobPlayerComponent } from './Components/status/bob-player-component';
import { BobPlayerStatusComponent } from './Components/status/bob-player-status-component';
import { BobModalComponent } from './Components/modal/modal.component';

import { MusicService } from './Services/music.service';


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
    BobTabMainComponent,
    PlaylistInfoComponent,
    BobVolumeControl,
    BobVolumeSlaveControl,
    PlayListLastPlayed,
    PlaylistCurrentPlayed,
    BobTabSettingsComponent,
    BobTabSearchComponent,
    ResultInfoComponent,
    BobTabStatusComponent,
    BobTabPlaylistsComponent,
    BobPlaylistsDetailComponent,
    BobPlayerComponent,
    BobPlayerStatusComponent,
    BobModalComponent
  ],

  providers: [
    MusicService
  ],

  exports: [
    BobMasterComponent,
    BobTabMainComponent,
    PlaylistInfoComponent,
    BobVolumeControl,
    BobVolumeSlaveControl,
    PlayListLastPlayed,
    PlaylistCurrentPlayed,
    BobTabSettingsComponent,
    BobTabSearchComponent,
    ResultInfoComponent,
    BobTabStatusComponent,
    BobTabPlaylistsComponent,
    BobPlaylistsDetailComponent,
    BobPlayerComponent,
    BobPlayerStatusComponent
  ]

})
export class BobMusicModule {
}

