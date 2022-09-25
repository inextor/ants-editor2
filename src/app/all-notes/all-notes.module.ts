import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllNotesRoutingModule } from './all-notes-routing.module';
import { AllNotesComponent } from './all-notes.component';


@NgModule({
  declarations: [
    AllNotesComponent
  ],
  imports: [
    CommonModule,
    AllNotesRoutingModule
  ]
})
export class AllNotesModule { }
