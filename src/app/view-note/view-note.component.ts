import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { from, mergeMap } from 'rxjs';
import { Note } from '../classes/Models';
import { NoteDb } from '../classes/NotesDb';

@Component({
	selector: 'app-view-note',
	templateUrl: './view-note.component.html',
	styleUrls: ['./view-note.component.css']
})
export class ViewNoteComponent implements OnInit,OnDestroy{

	note_db:NoteDb | null = null;
	note: Note| null = null;
	constructor(public route: ActivatedRoute, public titleService: Title)
	{
	}
	ngOnDestroy(): void {
		throw new Error('Method not implemented.');
	}

	ngOnInit(): void {

		this.route.paramMap.pipe
		(
			mergeMap((paramMap:ParamMap)=>
			{
				if( this.note_db == null )
					this.note_db = new NoteDb();

				let key = parseInt( paramMap.get('id') as string ) as number;
				return from( this.note_db.get( key ) );
			})
		)
		.subscribe((note:Note)=>
		{
			this.titleService.setTitle( note.title );
			this.note = note;
		});
	}
}
