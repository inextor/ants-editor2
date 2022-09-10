import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
		{ path:"",loadChildren: () => import('./view-note/view-note.module').then(m => m.ViewNoteModule) }, 
		{ path: 'edit-note', loadChildren: () => import('./edit-note/edit-note.module').then(m => m.EditNoteModule) }, 
		{ path: 'backup', loadChildren: () => import('./backup/backup.module').then(m => m.BackupModule) },
		{ path: 'list-note', loadChildren: () => import('./list-note/list-note.module').then(m => m.ListNoteModule) 
	}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
