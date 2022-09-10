import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListNoteComponent } from './list-note.component';

const routes: Routes = [{ path: '', component: ListNoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListNoteRoutingModule { }
