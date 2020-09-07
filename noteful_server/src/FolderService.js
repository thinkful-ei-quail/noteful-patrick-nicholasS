const FolderService = {
  getAllFolders(db) {
    return db.select('*').from('folders');
  },
  getFolder(db, id) {
    return db.select('*').from('folders').where({id}).first();
  },
  updateFolder(db, id, folder) {
    return db('folders').where({id}).update(folder);
  },
  deleteFolder(db, id) {
    return this.getFolder(db, id).delete();
  },
  addFolder(db, folder) {
    return db.insert(folder).into('folders').returning('*').then(rows => {
      return rows[0];
    });
  }
}

module.exports = FolderService;