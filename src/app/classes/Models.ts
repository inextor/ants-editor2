export interface Backup
{
	id:string
	object:any;
}

export interface Note
{
	id:number;
	access_count:number;
	is_markdown: boolean;
	search:string;
	text:string;
	title:string
	updated:Date;
	last_access:Date;
	tags:string[];
}

export interface Note_Term
{
	id:number
	note_id:number;
	position:number;
	term:string;
}
