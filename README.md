# cerebro-plugin-boostnote

[![Build Status](https://travis-ci.org/brpaz/cerebro-plugin-boostnote.svg?branch=master)](https://travis-ci.org/brpaz/cerebro-plugin-boostnote)

> Cerebro plugin for searching [Boostnote](https://boostnote.io) notes.

![](demo.gif)

## Install

On Cerebro window, ```plugin install``` and search for "Boostnote" plugin.

**This plugin is not compatible with the upstream Cerebro application until [this](https://github.com/KELiON/cerebro/pull/433) PR is merged. To be able to use this plugin right now, you need to build Cerebro from source and include the code from the specified PR.**

## Usage

* To be able to use this plugin, you need to configure the "storagePath" option in the plugin settings. This can be any folder where your Boostnote are stored (and can include multiple Boostnote storage folders).

* Cerebro will automatically index all your notes in the background hourly. To force an index update or after configuring the plugin, run ```boost reload```.

* The plugin can be triggered either by typing "boost" or "!b".

* You can filter by tags using "hash" sign. Ex: "#php", it will display all notes with tag "PHP".

## Development

**Clone repo**

```
git clone https://github.com/brpaz/cerebro-plugin-boostnote
```

**Install dependencies**

```
yarn install
```

**Launch the plugin**

```npm start```

- A symlink will be created between the plugin folder and the Cerebro plugins folder.
- You will need to reload your Cerebro settings (Right click on Cerebro tray icon -> Development -> Reload).
- You can use Cerebro Dev Tools to debug your plugin.

## Related

* [Cerebro](http://github.com/KELiON/cerebro) – Plugin extracted from core Cerebro app.
* [cerebro-plugin](http://github.com/KELiON/cerebro-plugin) – Boilerplate to create Cerebro plugins.
* [Cerebro Plugin docs](https://github.com/KELiON/cerebro/tree/master/docs) - Official Cerebro Plugins documentation.
