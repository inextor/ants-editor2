import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../classes/Models';
import { NoteDb } from '../classes/NotesDb';

@Component({
	selector: 'app-backup',
	templateUrl: './backup.component.html',
	styleUrls: ['./backup.component.css']
})
export class BackupComponent implements OnInit {
	note_array: Note[] = [];
	file:File | null = null;
	note_db:NoteDb | null = null;
	use_fast:number = 0;

	constructor(public router: Router, public route: ActivatedRoute, public titleService: Title)
	{
	}

	ngOnDestroy(): void
	{
		if( this.note_db )
		{
			this.note_db.close();
			this.note_db = null;
		}
	}

	ngOnInit(): void
	{
		this.note_db = new NoteDb();
	}

	fileChange(evt:any)
	{
		console.log( evt.target.files );
		if( evt.target.files.length )
		{
			this.file = evt.target.files[0] as File;
		}
	}

	importJson(evt:Event)
	{
		evt.preventDefault();
		evt.stopPropagation();

		console.log('IMporting');
		if( this.file )
		{
			let reader = new FileReader();
			reader.readAsText( this.file, "UTF-8" );
			reader.onload = (evt)=>{
				console.log('onLoad');
				if( evt.target == null )
				{
					console.log(' target is null');
					return;
				}

				try
				{
					let obj = JSON.parse( evt.target.result as string);
					let c_date = new Date().toISOString();

					let notes:Note[] = obj.notes.map((x:any)=>
					{
						let n:Note = {
							id : x.id,
							access_count: x.access_count | 0,
							last_access: new Date(),
							updated: new Date(),
							title: x.title,
							search: '',
							is_markdown: x.is_markdown || false,
							tags:[],
							text:x.text,
						};

						let last_accesss = Date.parse( x.last_accesss || c_date );
						n.last_access.setTime( last_accesss );

						let updated = Date.parse(x.updated || c_date );
						n.updated.setTime( updated );
						return n;
					});

					console.log( 'Notes is ', notes );

					if( this.note_db == null )
						this.note_db = new NoteDb();

					console.time('sync');

					if( this.use_fast == 0 )
					{
						console.log('Using slow');
						this.note_db.syncSlowNotes( notes )
						.then((response)=>
						{
							console.timeEnd('sync');
							console.log('It works slow ends');
						}).catch((error)=>{
							console.timeEnd('sync');
							console.log('Fail to update', error);
						});
					}
					else
					{
						console.log('Using fast');
						this.note_db.syncFastNotes( notes )
						.then((response)=>
						{
							console.timeEnd('sync');
							console.log('It fast ends');
							console.log('It works');
						}).catch((error)=>{
							console.timeEnd('sync');
							console.log('Fail to update', error);
						});

					}

				}
				catch(file_error)
				{
					console.log( file_error );
				}
			};
		}
		else
		{
			console.log('No File here');

		}
	}
}
