import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewNoteRoutingModule } from './view-note-routing.module';
import { ViewNoteComponent } from './view-note.component';


@NgModule({
  declarations: [
    ViewNoteComponent
  ],
  imports: [
    CommonModule,
    ViewNoteRoutingModule
  ]
})
export class ViewNoteModule { }
