import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material';
import { MatTabsModule } from '@angular/material';

import { AppComponent } from './app.component';
import { MainUiComponent } from './main-ui/main-ui.component';

@NgModule({
  declarations: [
    AppComponent,
    MainUiComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
