function makeNotesArray() {
  return [
    {
      id: 1,
      date_modified: '2020-08-25T16:40:48.560Z',
      name: 'First note',
      description: 'desc',
      folder: 1
    },
    {
      id: 2,
      date_modified: '2020-08-25T16:40:48.560Z',
      name: 'Second note',
      description: 'descr',
      folder: 2
    },
    {
      id: 3,
      date_modified: '2020-08-25T16:40:48.560Z',
      name: 'Third note',
      description: 'descri',
      folder: 3
    },
    {
      id: 4,
      date_modified: '2020-08-25T16:40:48.560Z',
      name: 'Fourth note',
      description: 'descrip',
      folder: 4
    },
  ];
}

module.exports = {
  makeNotesArray
}