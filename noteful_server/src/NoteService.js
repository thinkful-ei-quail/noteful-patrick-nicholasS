const NoteService = {
  getAllNotes(db) {
    return db.select('*').from('notes');
  },
  getNote(db, id) {
    return db.select('*').from('notes').where({id}).first();
  },
  updateNote(db, id, note) {
    return db('notes').where({id}).update(note);
  },
  deleteNote(db, id) {
    return this.getNote(db, id).delete();
  },
  addNote(db, note) {
    return db.insert(note).into('notes').returning('*').then(rows => {
      return rows[0];
    });
  }
}

module.exports = NoteService;