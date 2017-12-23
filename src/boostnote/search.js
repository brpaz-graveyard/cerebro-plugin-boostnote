const { memoize } = require('cerebro-tools');

const TAGS_REGEX = /#([\w]+)/gi;

const MEMOIZE_OPTIONS = {
  length: false,
  promise: 'then',
  maxAge: 5 * 60 * 1000,
  preFetch: true
};

/**
 * Search notes by title and tags
 * @param {array} The notes to search
 * @param {string} The search term
 * @return {array} Array containing the filtered notes.
 */
const search = memoize((notes, term) => {

  let normalizedTerm = term.toLowerCase();

  const inputTags = [];
  let m = null;

  // eslint-disable-next-line no-cond-assign
  while ((m = TAGS_REGEX.exec(normalizedTerm)) !== null) {
    inputTags.push(m[1]);

    // remove the tags from the search term.
    normalizedTerm = normalizedTerm.replace(`#${m[1]}`, '');
  }

  // First filter note by tags, then by title

  if (inputTags.length > 0) {
    // eslint-disable-next-line no-param-reassign
    notes = notes.filter((note) => {
      if (note.tags.some(r => inputTags.indexOf(r) !== -1)) {
        return true;
      }

      return false;
    });
  }

  if (normalizedTerm.trim() !== '') {
    // eslint-disable-next-line no-param-reassign
    notes = notes.filter((note) => {
      if (note.title.toLowerCase().includes(normalizedTerm)) {
        return true;
      }

      return false;
    });
  }

  return notes;

}, MEMOIZE_OPTIONS);

module.exports = {
  search
};
