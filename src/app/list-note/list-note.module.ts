import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListNoteRoutingModule } from './list-note-routing.module';
import { ListNoteComponent } from './list-note.component';


@NgModule({
  declarations: [
    ListNoteComponent
  ],
  imports: [
    CommonModule,
    ListNoteRoutingModule
  ]
})
export class ListNoteModule { }
