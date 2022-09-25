export const OFFLINE_DB_SCHEMA = {
	name: 'notes',
	version: 22,
	schema: {
			notes:'id,title,search,*tags,updated,access_count',
			note_terms:'++id,note_id,term',
			backup:'id'
	}
};
