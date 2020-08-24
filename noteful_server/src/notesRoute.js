require('dotenv').config();
const express = require('express');
const notesRoute = express.Router();
const NoteService = require('./NoteService');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

notesRoute
.route('/note')
.get((req, res, next) => {
  NoteService.getAllNotes(db)
  .then(result => {
    res.status(200).send(result);
  })
  .catch(() => next());
})
.put((req, res, next) => {
  const body = req.body;
  const note = {
    name: body.name,
    description: body.description,
    folder: body.folder
  }
  NoteService.addNote(db, note)
  .then(result => {
    res.status(201).send(result.id);
  })
  .catch(() => next());
});

notesRoute
.route('/note/:id')
.get((req, res, next) => {
  const {id} = req.params;
  NoteService.getNote(db, id)
  .then(result => {
    if(!result) {
      return res.status(404).send('Note does not exist');
    }
    res.status(200).send(result);
  })
  .catch(() => next());
})
.post((req, res, next) => {
  const {body} = req;
  const {id} = req.params;
  const note = {
    name: body.name,
    description: body.description,
    date_modified: Date.now()
  }
  NoteService.updateNote(db, id, note)
  .then(() => res.status(202).end())
  .catch(() => next());
})
.delete((req, res, next) => {
  const {id} = req.params;
  NoteService.deleteNote(db, id)
  .then(() => {
    res.status(202).end();
  })
  .catch(() => next());
})

module.exports = notesRoute;