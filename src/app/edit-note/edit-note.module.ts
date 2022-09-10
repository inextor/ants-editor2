import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditNoteRoutingModule } from './edit-note-routing.module';
import { EditNoteComponent } from './edit-note.component';


@NgModule({
  declarations: [
    EditNoteComponent
  ],
  imports: [
    CommonModule,
    EditNoteRoutingModule
  ]
})
export class EditNoteModule { }
