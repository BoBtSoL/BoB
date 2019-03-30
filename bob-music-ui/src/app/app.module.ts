import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material';

import { AppComponent } from './app.component';
import { MasterComponent } from './master/master.component';

import { MatTabsModule } from '@angular/material';
import { DirectControlComponent } from './direct-control/direct-control.component';

@NgModule({
  declarations: [
    AppComponent,
    MasterComponent,
    DirectControlComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
