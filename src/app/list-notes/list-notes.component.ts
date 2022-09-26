import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../classes/Models';
import { OFFLINE_DB_SCHEMA } from '../constants';
import { DatabaseStore } from '../Finger/DatabaseStore';
import { NoteDb } from '../classes/NotesDb';


@Component({
	selector: 'app-list-notes',
	templateUrl: './list-notes.component.html',
	styleUrls: ['./list-notes.component.css']
})
export class ListNotesComponent implements OnInit,OnDestroy
{
	note_db = new NoteDb();
	note_array: Note[] = [];

	constructor(public router: Router, public route: ActivatedRoute, public titleService: Title)
	{
	}

	ngOnDestroy(): void {
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe((param_map)=>
		{
			this.note_db.getAll().then((response)=>{
				this.note_array = response as Note[];
			}).catch((error:any)=>{
				console.log('Error reading', error);
			});

		},(e:any)=>{
			console.log(e);
		});
	}
}
