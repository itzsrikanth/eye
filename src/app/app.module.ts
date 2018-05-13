import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MatSelectModule } from '@angular/material';
// import { ColorPickerModule } from 'angular4-color-picker';

import { AppComponent } from './app.component';
import { FullScreenComponent } from './fullScreen/fullScreen.component';
import { ArtBoardComponent } from './artBoard/artBoard.component';
// import { BlinkerDirective } from './blinker.directive';

@NgModule({
  imports:      [ 
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    // MatSelectModule
    // ColorPickerModule
  ],
  declarations: [ 
    AppComponent, 
    ArtBoardComponent, 
    FullScreenComponent ,
    // BlinkerDirective,
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
