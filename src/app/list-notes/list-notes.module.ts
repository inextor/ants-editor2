import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListNotesRoutingModule } from './list-notes-routing.module';
import { ListNotesComponent } from './list-notes.component';


@NgModule({
  declarations: [
    ListNotesComponent
  ],
  imports: [
    CommonModule,
    ListNotesRoutingModule
  ]
})
export class ListNotesModule { }
