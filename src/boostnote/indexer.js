

const glob = require('glob-promise');
const CSON = require('cson-parser');
const fs = require('fs-extra');
const path = require('path');
const uuidv4 = require('uuid/v4');
const noteType = require('./noteType');

/**
 * Get the snippet language.
 * @param {object} note
 */
const getNoteLanguage = (note) => {
  if (note.type === noteType.NOTE_TYPE_MARKDOWN) {
    return 'markdown';
  }

  const snippetLang = note.snippets[0].mode.toLowerCase();

  switch (snippetLang) {
    case 'shell':
    case 'sh':
      return 'bash';
    default:
      return snippetLang;
  }
};

/**
 * Map Boostnote notes object into the format required by our application
 * @param {object} note The note object
 * @return {object}
 */
const mapNote = note => ({
  id: uuidv4(),
  title: note.title,
  tags: note.tags,
  content: note.type === noteType.NOTE_TYPE_MARKDOWN ? note.content : note.snippets[0].content,
  language: getNoteLanguage(note),
  type: note.type === noteType.NOTE_TYPE_MARKDOWN ? 'markdown' : 'snippet'
});

/**
 * Loads notes from Boostnote
 * @param {string} storageDir The path to the root directory where Boostnote Notes are stored.
 */
const index = storageDir => new Promise((resolve, reject) => {
  const notes = [];
  glob('**/*.cson', { cwd: storageDir }).then((files) => {

    const promises = [];
    for (const file of files) {
      const filePath = path.join(storageDir, file);
      promises.push(fs.readFile(filePath, 'utf8'));
    }

    Promise.all(promises).then((fileContents) => {

      for (const content of fileContents) {
        const note = CSON.parse(content);

        // ignore deleted notes
        if (note.isTrashed) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const mappedNote = mapNote(note);
        notes.push(mappedNote);
        // for snippet notes -> separate into multiple notes
        /* if (note.type === NOTE_TYPE_MARKDOWN) {
          mappedNote.content = note.content;
        } else {
          // TODO transform each snippet into a separate note.
          mappedNote.content = notes.snippets[0].content;
        } */
      }

      resolve(notes);
    });


  }).catch((err) => {
    reject(err);
  });
});


module.exports = {
  index
};
