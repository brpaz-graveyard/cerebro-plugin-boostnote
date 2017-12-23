
const PLUGIN_NAME = 'boosnote';
const PLUGIN_KEYWORD = '!b';
const PLUGIN_REGEX = /(boost|!b)(.*)/;

const Timer = require('timer-machine');

const icon = require('../assets/icon.png');
const Indexer = require('./boostnote/indexer');
const Search = require('./boostnote/search');

// eslint-disable-next-line no-unused-vars
const Preview = require('./Preview/preview');

/**
 * Contains all Boostnote notes stored in memory.
 * TODO monitor if is ok to have all notes in memory or to write to a file.
 */
let notesList = [];

// No idea where this come from, but it works.

// eslint-disable-next-line no-new, no-undef
if (!Notification.permission) {
  // eslint-disable-next-line no-new, no-undef
  Notification.requestPermission();
}

/**
 * Indexes Notes and loads into memory.
 * @returns {Promise}
 */
const index = storagePath => new Promise((resolve, reject) => {
  console.log(`${PLUGIN_NAME} - Indexing notes. This might take a while`);
  const timer = new Timer();
  timer.start();

  Indexer.index(storagePath).then((notes) => {
    timer.stop();
    console.log(`${PLUGIN_NAME} Indexed ${notes.length} notes in ${timer.time()}ms`);
    resolve(notes);
  }).catch((err) => {
    console.log(`${PLUGIN_NAME} Error indexing notes ${err}`);
    reject(err);
  });
});

/**
 * Displays the main plugin menu
 * @param {object} display
 * @param {object} actions
 */
const displayMenu = (display, actions) => {
  display([{
    title: 'Keep typing for searching notes',
    icon: icon,
  }, {
    title: 'Reload',
    icon: icon,
    subtitle: 'Reload notes index',
    autocomplete: 'reload',
    onSelect: (event) => {
      actions.replaceTerm(`${PLUGIN_KEYWORD} reload`);
      event.preventDefault();
    }
  }]);
};

/**
 * Displays the results.
 */
const displayResults = (term, results, display, actions, settings) => {
  if (results.length === 0) {
    display({
      title: `No notes found matching: ${term}`,
      icon: icon,
    });
  } else {
    const resultsToDisplay = results.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.tags.join(' , '),
      icon: icon,
      clipboard: item.content,
      getPreview: () => <Preview key={item.id} note={item} isDarkTheme={settings.darkTheme} />,
      onSelect: () => {
        actions.copyToClipboard(item.content);
      }
    }));

    display(resultsToDisplay);
  }
};

/**
 * Plugin entrypoint.
 * @see https://github.com/KELiON/cerebro/blob/master/docs/plugins.md for documentation
 *
 * @param {string} term The searched term
 * @param {object} dsiplay Display object used for rendering results
 * @param {object} actions Use to execute actions on plugin
 * @param {object} settings The plugin settings
 */
const plugin = ({
  term, display, actions, settings
}) => {
  const match = term.match(PLUGIN_REGEX);

  if (match) {
    const input = match[2].trim();

    let results = [];
    switch (input) {
      case 'reload':
        display({
          title: 'Reload notes index',
          icon: icon,
          onSelect: (event) => {
            event.preventDefault();
            index(settings.storagePath).then((notes) => {
              notesList = notes;
              // eslint-disable-next-line no-new, no-undef
              new Notification('Notes updated with success', {
                icon: icon
              });
            }).catch((err) => {
              // eslint-disable-next-line no-new, no-undef
              new Notification('Error updating index', {
                body: err,
                icon,
                image: icon,
              });
            });
          }
        });
        break;
      case '':
        displayMenu(display, actions);
        break;
      default:
        results = Search.search(notesList, input);
        displayResults(input, results, display, actions, settings);
        break;
    }
  }
};

/**
 * Indexes Boostnote notes on startup
 * @see https://github.com/KELiON/cerebro/blob/master/docs/plugins/examples.md#using-initialize
 */
const initialize = (cb, settings) => {

  if (settings.storagePath) {
    index(settings.storagePath).then((notes) => {
      cb(notes);
    });
  } else {
    console.log('No storage path configured in plugin settings. Skipping');
  }

  // update index every our.
  setInterval(() => {
    initialize(cb, settings);
  }, 1000 * 60 * 60);
};

/**
 * Callback function executed after receiving the response from "initializeAsync" function
 * @param {object} notes The list of loaded notes
 */
const onMessage = (notes) => {
  notesList = notes;
};

module.exports = {
  fn: plugin,
  name: PLUGIN_NAME,
  keyword: PLUGIN_KEYWORD,
  icon,
  initializeAsync: initialize,
  onMessage: onMessage,
  settings: {
    storagePath: { type: 'string' },
    darkTheme: { type: 'bool', defaultValue: false },
  }
};
