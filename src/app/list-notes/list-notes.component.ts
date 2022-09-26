import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../classes/Models';
import { NoteDb } from '../classes/NotesDb';
import {from, Subject } from 'rxjs';
import {debounceTime,  mergeMap} from 'rxjs/operators';
import { SubSink } from 'subsink';


@Component({
	selector: 'app-list-notes',
	templateUrl: './list-notes.component.html',
	styleUrls: ['./list-notes.component.css']
})
export class ListNotesComponent implements OnInit,OnDestroy
{
	note_db = new NoteDb();
	note_array: Note[] = [];
	search_subject = new Subject<string>();
	subs = new SubSink();

	constructor(public router: Router, public route: ActivatedRoute, public titleService: Title)
	{
	}

	ngOnDestroy(): void {
	}

	ngOnInit(): void {
		this.subs.sink = this.route.paramMap.subscribe((_param_map)=>
		{
			this.note_db.getAll().then((response)=>{
				this.note_array = response as Note[];
			}).catch((error:any)=>{
				console.log('Error reading', error);
			});
		},(e:any)=>{
			console.log(e);
		});

		this.subs.sink = this.search_subject.pipe
		(
			debounceTime(250),
			mergeMap((search:string)=>{
				console.log('Searching for',search);
				return from( this.note_db.search( search ) );
			})
		)
		.subscribe((response)=>
		{
			this.note_array = response;
		});
	}

	onSearch(evt:Event)
	{
		let target = evt.target as HTMLInputElement;
		this.search_subject.next( target.value.trim() );
	}
}
