import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
		{ path:"",loadChildren: () => import('./list-notes/list-notes.module').then(m => m.ListNotesModule) },
		{ path: 'edit-note', loadChildren: () => import('./edit-note/edit-note.module').then(m => m.EditNoteModule) }, 
		{ path: 'backup', loadChildren: () => import('./backup/backup.module').then(m => m.BackupModule) },
		{ path: 'view-note', loadChildren: () => import('./view-note/view-note.module').then(m => m.ViewNoteModule) },
		{ path: 'backup', loadChildren: () => import('./backup/backup.module').then(m => m.BackupModule) },
		{ path: 'edit-note', loadChildren: () => import('./edit-note/edit-note.module').then(m => m.EditNoteModule) },
		{ path: 'list-notes', loadChildren: () => import('./list-notes/list-notes.module').then(m => m.ListNotesModule) },
		{ path: 'all-notes', loadChildren: () => import('./all-notes/all-notes.module').then(m => m.AllNotesModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
