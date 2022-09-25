import { OFFLINE_DB_SCHEMA } from '../constants';
import { DatabaseStore } from '../Finger/DatabaseStore';
import { ObjectStore } from '../Finger/ObjectStore';
import { Options } from '../Finger/OptionsUtils';
import {Note, Note_Term} from './Models';

export class NoteDb
{
	database: DatabaseStore;
    debug: boolean = true;
	constructor()
	{
		this.database = DatabaseStore.builder
		(
			OFFLINE_DB_SCHEMA.name,
			OFFLINE_DB_SCHEMA.version,
			OFFLINE_DB_SCHEMA.schema
		);
	}



	updateAllNotes(notes:Note[]):Promise<Note[]>
	{
		return Promise.resolve([]);
	}

	syncSlowNotes(notes:Note[]):Promise<any>
	{
		return this.database.transaction(['notes','note_terms'],'readwrite',(stores,txt)=>
		{
			let promises:Promise<any>[] = notes.map(n=>this.updateNoteStore(stores,n,n.text,txt));
			return Promise.all( promises );
		});
	}

	close()
	{
		this.database.close();
	}

	updateNoteStore(stores:Record<string,ObjectStore<any>>, old_note:Note, text:string, txt:any):Promise<any>
	{
		if( this.debug )
		{
			console.log(txt);
		}

		let new_note = this.getNoteFromText( text );
		new_note.updated = new Date();
		new_note.id = old_note.id;
		new_note.access_count = (old_note.access_count || 0)+1;
		let terms = this.getTerms(text)
			.map((t)=>{
				t.note_id = old_note.id;
				return t as Note_Term;
			});

		let option = Options.build({index:'note_id','=':old_note.id});

		return Promise.all
		([
			stores['notes'].put( new_note, undefined),
			stores['note_terms'].removeAll(option).then((_response)=>
			{
				return stores['note_terms'].addAllFast( terms, true )
			})
		]);
	}

	//addNoteStore(stores:Record<string,ObjectStore<any>>,text:string):Promise<Note>
	//{
	//	let new_note = this.getNoteFromText( text );
	//	new_note.updated = new Date();
	//	new_note.access_count = 0;

	//	let terms = this.getTerms(text);

	//	return stores['store'].add( new_note )
	//	.then((note:Note)=>{
	//		for(let t of terms )
	//		{
	//			t.note_id = note.id;
	//		}

	//		return  stores['note_terms'].addAllFast( terms, true )
	//		.then((_r)=>
	//		{
	//			return Promise.resolve( note );
	//		});
	//	});
	//}


	getTerms(str:string):Partial<Note_Term>[]
	{
		let terms:Partial<Note_Term>[] = [];
		let term_dict:Record<string,boolean> = {};
		let regex = /[\b;:,\\\/\-+{}\[\]\s\.`|?="*~<>]+/g;
		let all_terms = str.toLowerCase().split( regex  );

		let invalid = new RegExp('^#+$');

		let counter = 0;

		for(let word of all_terms)
		{
			if( word == '' || invalid.test( word ) ) 
				continue;

			counter++;

			if( word in term_dict)
				continue;

			terms.push({term: word, position: counter });
		}

		return terms;
	}



	getNoteFromText(text: string):Partial<Note>
	{
		let is_markdown = false;

		if( /^#+ /mg.test( text ) || /^==/mg.test( text ) )
		{
			is_markdown = true;
		}

		let title:string = text.trim().replace(/#/g,' ').split('\n')[0].trim();

		let obj:Partial<Note> = {
			text	: text,
			title	: title,
			search	: title.toLowerCase(),
			updated	: new Date(),
			is_markdown,
			last_access: new Date(),
			tags:[],
			access_count	: 1
		};
		return obj;
	}
}
