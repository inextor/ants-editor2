import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../classes/Models';
import { OFFLINE_DB_SCHEMA } from '../constants';
import { DatabaseStore } from '../Finger/DatabaseStore';

@Component({
	selector: 'app-list-notes',
	templateUrl: './list-notes.component.html',
	styleUrls: ['./list-notes.component.css']
})
export class ListNotesComponent implements OnInit,OnDestroy
{
	database = DatabaseStore.builder
	(
		OFFLINE_DB_SCHEMA.name,
		OFFLINE_DB_SCHEMA.version,
		OFFLINE_DB_SCHEMA.schema
	);
    note_array: Note[] = [];

	constructor(public router: Router, public route: ActivatedRoute, public titleService: Title)
	{
	}

    ngOnDestroy(): void {
    }

	ngOnInit(): void {
		this.database.init();

		this.route.paramMap.subscribe((param_map)=>
		{
			this.database.getAll('note').then((response)=>{
				this.note_array = response as Note[];
			});
			
		},(e)=>{console.log(e)});
	}

}
