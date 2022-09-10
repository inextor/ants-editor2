import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditNoteComponent } from './edit-note.component';

const routes: Routes = [{ path: '', component: EditNoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditNoteRoutingModule { }
