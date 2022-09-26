import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
	declarations: [FormsModule, HeaderComponent ],
	imports: [
		CommonModule,
		FormsModule,
		ScrollingModule
	],
	exports: [CommonModule,FormsModule]
})
export class SharedModule { }
