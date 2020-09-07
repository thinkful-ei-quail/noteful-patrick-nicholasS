require('dotenv').config();
const express = require('express');
const notesRoute = express.Router();
const NoteService = require('./NoteService');

notesRoute
  .route('/api/note')
  .get((req, res, next) => {
    NoteService.getAllNotes(req.app.get('db'))
      .then((result) => {
        res.status(200).send(result);
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const body = req.body;
    const note = {
      name: body.name,
      description: body.description,
      folder: body.folder,
    };
    NoteService.addNote(req.app.get('db'), note)
      .then((result) => {
        res
          .status(201)
          .location(`/api/note/${result.id}`)
          .json(result);
      })
      .catch(next);
  });

notesRoute
  .route('/api/note/:id')
  .all((req, res, next) => {
    NoteService.getNote(req.app.get('db'), req.params.id)
      .then((note) => {
        if (!note) {
          return res.status(404).send('Note does not exist');
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.status(200).json(res.note);
  })
  .patch((req, res, next) => {
    const { name, description } = req.body;
    const { id } = req.params;
    const note = {
      name,
      description,
      date_modified: new Date().toISOString(),
    };
    NoteService.updateNote(req.app.get('db'), id, note)
      .then(() => res.status(204).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    NoteService.deleteNote(req.app.get('db'), id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRoute;
