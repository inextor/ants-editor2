import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackupRoutingModule } from './backup-routing.module';
import { BackupComponent } from './backup.component';
import { FormsModule } from '@angular/forms';


@NgModule({
	declarations: [
		BackupComponent
	],
	imports: [
		CommonModule,
		BackupRoutingModule,
		FormsModule
	]
})
export class BackupModule { }
