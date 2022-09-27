import { OFFLINE_DB_SCHEMA } from '../constants';
import { DatabaseStore } from '../Finger/DatabaseStore';
import { ObjectStore } from '../Finger/ObjectStore';
import { Options } from '../Finger/OptionsUtils';
import {Note, Note_Term} from './Models';

interface Index_Note_Term
{
	index:number;
	term:Note_Term;
}

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

	syncFastNotes(notes:Note[]):Promise<any>
	{
		let new_notes:Note[] = [];
		let new_terms:Note_Term[] = [];

		for(let old_note of notes)
		{
			let new_note = this.getNoteFromText( old_note.text );
			new_note.updated = new Date();
			new_note.id = old_note.id;
			new_note.access_count = old_note.access_count+1;

			let terms = this.getTerms(old_note.text).map((t)=>
			{
				t.note_id = old_note.id;
				return t as Note_Term;
			});

			new_notes.push( new_note );
			new_terms.push( ...terms );
		}

		return this.database.transaction(['notes','note_terms'],'readwrite',(stores,txt)=>
		{
			return Promise.all
			([
				stores['notes'].updateAll( notes ),
				stores['note_terms'].clear()
				.then(()=>
				{
					return stores['note_terms'].addAllFast( new_terms, false );
				})
			]).then(()=>{
				console.log('Ends txt',txt);
			});
		}) as Promise<true>;
	}

	syncSlowNotes(notes:Note[]):Promise<any>
	{
		console.log('DOing something');
		return this.database.transaction(['notes','note_terms'],'readwrite',(stores,txt)=>
		{
			console.log('Ading new FOO');
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
			//console.log(txt);
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


	search( name:string ):Promise<Note[]>
	{
		return this.database.transaction(['notes','note_terms'],'readonly',(stores,_txt)=>
		{
			return this.getTermsIndex( stores['note_terms'], name ).then((terms)=>
			{
				let ids = terms.map( i => i.note_id );
				ids.sort();

				return stores['notes'].getAllByKeyIndex( ids ).then((notes:Note[])=>
				{
					console.log('Notes found',notes.length, ids );
					let indexes:Map<number,Index_Note_Term> =new Map();

					terms.forEach((i:Note_Term,index:number)=>{
						indexes.set( i.note_id,{ index: index, term: i });
						//indexes[ i.note_id ] ={ index: index, term: i }
					});

					let term_notes:Note[] = [];

					notes.forEach((i)=>{
					    //term_notes.push({ note: i, term: indexes[i.id ].term });
						i.term  = (indexes.get(i.id) as Index_Note_Term ).term;
						term_notes.push( i );
					});

					term_notes.sort(( a,b ) =>
					{
						let aa = indexes.get(a.id ) as Index_Note_Term;
						let bb = indexes.get(b.id ) as Index_Note_Term;
						if( bb.index == aa.index )
							return 0;

						return aa.index > bb.index ? 1 : -1;
					});

					return Promise.resolve( term_notes );
				});
			});
		});
	}


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

	getNoteFromText(text: string):Note
	{
		let is_markdown = false;

		if( /^#+ /mg.test( text ) || /^==/mg.test( text ) )
		{
			is_markdown = true;
		}

		let title:string = text.trim().replace(/#/g,' ').split('\n')[0].trim();

		let note:Note = {
			id: Date.now(),
			text	: text,
			title	: title,
			search	: title.toLowerCase(),
			updated	: new Date(),
			is_markdown,
			last_access: new Date(),
			tags:[],
			access_count	: 1
		};
		return note;
	}

	getAll():Promise<Note[]>
	{
		let option = Options.build({index:'last_access','direction':'prev'});
		return this.database.getAll('notes',option);
	}

	getTermsIndex( note_terms_store:ObjectStore<Note_Term>, term:string )
	{
		let tlower = term.toLowerCase();

		let bigger = tlower.toLowerCase().codePointAt( tlower.length -1 ) as number;

		if( isNaN(bigger)  )
		{
			bigger = 0xDFBE;
		}

		console.log('Code Point', bigger+1);
		let next = String.fromCodePoint( bigger+1 );
		let biggerString = tlower.substring(0, tlower.length-1 )+next;
		let option = Options.build({ index : 'term' , '>=': term.toLowerCase(), '<': biggerString });
		return note_terms_store.getAll(option)
		.then(( terms:Note_Term[] )=>
		{
			terms.sort((a:Note_Term,b:Note_Term)=>
			{
				if( a.position == b.position )
				{
					return b.term < a.term ? 1: -1;
				}

				return b.position < a.position ? 1: -1;
			});

			let keys:Map<number,boolean> = new Map();

			let finalResult = terms.filter((a:Note_Term) =>{

				if( keys.has( a.note_id) )
					return false;

				keys.set( a.note_id, true );
				return true;
			});

			return Promise.resolve( finalResult );
		});
	}

	getCodePoint(term:string)
	{
		let to_search = term;
		while(to_search.length > 0 )
		{
			let bigger = to_search.toLowerCase().codePointAt( to_search.length -1 ) as number;
			if( !isNaN( bigger ) )
			{
				return 
			}
			to_search = to_search.substring(0,to_search.length-1);
		}
	}

	get(key:number):Promise<Note>
	{
		return this.database.get('notes',key)
		.then((note)=>{
			if(!note)
				throw 'Note not found';
			return Promise.resolve( note ) as Promise<Note>;
		});
	}

}
