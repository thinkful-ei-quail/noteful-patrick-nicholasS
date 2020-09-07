const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./folders.fixtures');
const supertest = require('supertest');

describe('Folders testing', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  before('clean the table', () => {
    return db.raw('TRUNCATE folders RESTART IDENTITY CASCADE');
  });

  afterEach('cleanup', () => {
    return db.raw('TRUNCATE folders RESTART IDENTITY CASCADE');
  });

  after('disconnect from db', () => db.destroy());

  context('Given the database has data', () => {
    const testFolders = makeFoldersArray();

    beforeEach('insert folders', () => {
      return db.into('folders').insert(testFolders);
    });

    it('retrieves all folders', () => {
      return supertest(app)
      .get('/api/folder')
      .expect(200, testFolders);
    });

    it('retrieves a single folder', () => {
      return supertest(app)
      .get('/api/folder/1')
      .expect(200, testFolders[0]);
    });

    it('returns 404 when folder doesn\'t exist', () => {
      return supertest(app)
      .get('/api/folder/5')
      .expect(404, 'Folder does not exist');
    });

    it('updates a folder', () => {
      let data = {
        ...testFolders[1]
      };
      const newFolder = {
        name: data.name,
      };
      data.id = 1;
      return supertest(app)
      .patch('/api/folder/1')
      .send(newFolder)
      .expect(204)
      .then(res =>
        supertest(app)
          .get(`/api/folder/${data.id}`)
          .then(res => expect(() => {
            expect(data.name).to.eql(res.name);
            expect(data.id).to.eql(res.id);
          }))
      );
    })

    it('returns 404 when folder to update doesn\'t exist', () => {
      const fake = {
        name: 'whatever'
      };
      return supertest(app)
      .patch('/api/folder/6')
      .send(fake)
      .expect(404)
      .expect('Folder does not exist');
    });

    it('deletes a folder', () => {
      return supertest(app)
      .delete('/api/folder/1')
      .expect(204)
      .then(() => 
        supertest(app)
        .get('/api/folder/1')
       .expect(404)
       .expect('Folder does not exist'))
    });
  });

  context('Given the database has no data', () => {

    it('allFolders retrieves empty array', () => {
      return supertest(app)
      .get('/api/folder')
      .expect(200, []);
    });

    it('returns 404 when trying to access a folder', () => {
      return supertest(app)
      .get('/api/folder/1')
      .expect(404, 'Folder does not exist');
    });

    it('puts a folder in the database', () => {
        const folder = makeFoldersArray()[0];
        return supertest(app)
        .post('/api/folder')
        .send(folder)
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(folder.name);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/folder/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/folder/${res.body.id}`)
            .expect(res.body)
        )
    });
  });
});
