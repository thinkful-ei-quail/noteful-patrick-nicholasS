const knex = require('knex');
const app = require('../src/app');
const { makeNotesArray } = require('./notes.fixtures');
const { makeFoldersArray } = require('./folders.fixtures');
const supertest = require('supertest');

describe('Notes testing', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  before('clean the table', () => {
    return db.raw('TRUNCATE notes, folders RESTART IDENTITY CASCADE');
  });

  afterEach('cleanup', () => {
    return db.raw('TRUNCATE notes, folders RESTART IDENTITY CASCADE');
  });

  after('disconnect from db', () => db.destroy());

  context('Given the database has data', () => {
    const testNotes = makeNotesArray();
    const testFolders = makeFoldersArray();

    beforeEach('insert folders and notes', () => {
      return db.into('folders').insert(testFolders)
      .then(() => {
        return db.into('notes').insert(testNotes);
      })
    });

    it('retrieves all notes', () => {
      return supertest(app)
      .get('/api/note')
      .expect(200, testNotes);
    });

    it('retrieves a single note', () => {
      return supertest(app)
      .get('/api/note/1')
      .expect(200, testNotes[0]);
    });

    it('returns 404 when note doesn\'t exist', () => {
      return supertest(app)
      .get('/api/note/5')
      .expect(404, 'Note does not exist');
    });

    it('updates a note', () => {
      let data = testNotes[1];
      const newNote = {
        name: data.name,
        description: data.description
      };
      data = {
        ...data,
        id: 1,
        folder: 1
      }
      return supertest(app)
      .patch('/api/note/1')
      .send(newNote)
      .expect(204)
      .then(res =>
        supertest(app)
          .get(`/api/note/${data.id}`)
          .then(res => expect(() => {
            expect(data.name).to.eql(res.name);
            expect(data.description).to.eql(res.description);
            expect(data.id).to.eql(res.id);
            expect(data.folder).to.eql(res.folder);
          }))
      );
    })

    it('returns 404 when note to update doesn\'t exist', () => {
      const fake = {
        name: 'whatever'
      };
      return supertest(app)
      .patch('/api/note/6')
      .send(fake)
      .expect(404)
      .expect('Note does not exist');
    });

    it('deletes a note', () => {
      return supertest(app)
      .delete('/api/note/1')
      .expect(204)
      .then(() => 
        supertest(app)
        .get('/api/note/1')
       .expect(404)
       .expect('Note does not exist'))
    });
  });

  context('Given the database has no data', () => {

    beforeEach('Set up folders', () => {
      return db.into('folders').insert(makeFoldersArray());
    });

    it('allNotes retrieves empty array', () => {
      return supertest(app)
      .get('/api/note')
      .expect(200, []);
    });

    it('returns 404 when trying to access a note', () => {
      return supertest(app)
      .get('/api/note/1')
      .expect(404, 'Note does not exist');
    });

    it('puts a note in the database', () => {
        const note = makeNotesArray()[0];
        return supertest(app)
        .post('/api/note')
        .send(note)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(note.name);
          expect(res.body.description).to.eql(note.description);
          expect(res.body.folder).to.eql(note.folder);
          expect(res.body).to.have.property('date_modified');
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/note/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/note/${res.body.id}`)
            .expect(res.body)
        )
    });
  });
});
