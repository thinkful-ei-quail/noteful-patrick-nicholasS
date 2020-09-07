require('dotenv').config();
const express = require('express');
const folderRoute = express.Router();
const FolderService = require('./FolderService');

folderRoute
  .route('/api/folder')
  .get((req, res, next) => {
    FolderService.getAllFolders(req.app.get('db'))
      .then((result) => {
        res.status(200).send(result);
      })
      .catch(next);
  })
  .post((req, res, next) => {
    const body = req.body;
    const folder = {
      name: body.name,
    };
    FolderService.addFolder(req.app.get('db'), folder)
      .then((result) => {
        res
          .status(201)
          .location(`/api/folder/${result.id}`)
          .json(result);
      })
      .catch(next);
  });

folderRoute
  .route('/api/folder/:id')
  .all((req, res, next) => {
    FolderService.getFolder(req.app.get('db'), req.params.id)
      .then((folder) => {
        if (!folder) {
          return res.status(404).send('Folder does not exist');
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.status(200).json(res.folder);
  })
  .patch((req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;
    const folder = {
      name,
    };
    FolderService.updateFolder(req.app.get('db'), id, folder)
      .then(() => res.status(204).end())
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    FolderService.deleteFolder(req.app.get('db'), id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = folderRoute;
