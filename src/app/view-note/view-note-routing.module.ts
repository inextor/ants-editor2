import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewNoteComponent } from './view-note.component';

const routes: Routes = [{ path: '', component: ViewNoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewNoteRoutingModule { }
