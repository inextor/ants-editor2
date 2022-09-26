export const OFFLINE_DB_SCHEMA = {
	name: 'notes',
	version: 23,
	schema: {
			notes:'id,title,search,*tags,updated,access_count,last_access',
			note_terms:'++id,note_id,term',
			backup:'id'
	}
};
