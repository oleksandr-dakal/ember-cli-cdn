# Ember-cli-cdn

[![dependencies](https://david-dm.org/dakal-oleksandr/ember-cli-cdn.svg)](https://david-dm.org/dakal-oleksandr/ember-cli-cdn) [![Build Status](https://travis-ci.org/dakal-oleksandr/ember-cli-cdn.svg?branch=master)](https://travis-ci.org/dakal-oleksandr/ember-cli-cdn)

## Installation

To install as an Ember CLI addon:

`$ ember install ember-cli-cdn`

### Why to use

This addon allows to work with local copies of libraries during development, 
and then automate switching to your CDN version when you deploy your application.
Addon parse files content, replace matched local links to specified CDN version and 
exclude them from files concatenation.

### Usage

##### Add to index.html

Include container to add excluded from concatenation:

`{{content-for 'cdn-styles'}}`

and

`{{content-for 'cdn-scripts'}}`

##### ember-cli-build.js

```
var app = new EmberApp({
  cdn: {
    files: [{
      file: '**/jquery.*js',
      cdn: 'google:jquery'
    }, {
      file: '**/bootstrap.*css',
      package: 'bootstrap',
      cdn: 'cdnjs:twitter-bootstrap:css/bootstrap.min.css'
    }]
  }
});

app.import('bower_components/bootstrap/dist/css/bootstrap.css');
```

As result jQuery.js and bootstrap.css will be excluded from vendor concatenated files and included to 
html as separate tags that loads from CDN.

```
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/css/bootstrap.min.css" />

<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

<script>if(!(window.jQuery)) cdnizerLoad("assets/jquery-7decc060e1d33ab4c0ea42ed03d3d797.js");</script>
```

## Options

#### options.enabled

Define if plugin is enabled. By default plugin enabled with environment `production`.

#### options.original

Define if original link will be added to tags as `data-original` attribute.

#### options.files[ ]

Files configurations.

#### options.files[ ].file

Type: `String` (Required)

Glob to match against for the file to cdnize. All properties within this object will be 
applied to all files that match the glob. Globs are matched in a first-come, first-served basis, 
where only the first matched object hashmap is applied.

#### options.files[ ].package

Type: `String`

Bower package name for this source or set of sources. By providing the package name, addon will look 
up the version string of the *currently installed* Bower package, and provide it as a property to the `cdn` 
string. This is done by looking for either the `bower.json` or `.bower.json` file within your 
Bower components directory.

The benefit of doing it this way is that the version used from the CDN *always* matches your local copy. 
It will never automatically be updated to a newer patch version without being tested.

#### options.files[ ].cdn

Type: `String`

This it the template for the replacement string. It can either be a custom CDN string, or it can be a 
common public CDN string.

*Common Public CDN String:*

Load in the default data for an existing common public CDN, using the format `'<provider>:<package>(:filename)?(@version)?'`.
You can then customize the settings for the package, by overriding any property in this 
section (e.g.: providing a fallback `test`, a different `package` name, or even matching a different `file`).

*Custom CDN String:*

Provide a custom CDN string, which can be a simple static string, or contain one or more underscore/lodash 
template properties to be injected into the string:

* `versionFull`: if `package` was provided, this is the complete version currently installed version from Bower.
* `version`: if `package` was provided, this is the `major(.minor)?(.patch)?` version number, minus any trailing information (such as `-beta*` or `-snapshot*`).
* `major`: if `package` was provided, this is the major version number.
* `minor`: if `package` was provided, this is the minor version number.
* `patch`: if `package` was provided, this is the patch version number.
* `defaultBase`: the default base provided above.  Note that this will *never* end with a trailing slash.
* `filepath`: the full path of the source, as it exists currently.  There is no guarantee about the whether this contains a leading slash or not, so be careful.
* `filepathRel`: the relative path of the source, guaranteed to *never* have a leading slash. The path is also processed against `options.relativeRoot` above, to try and remove any parent directory path elements.
* `filename`: the name of the file, without any parent directories
* `filenameMin`: the name of the file, *without* any rev tags (if `allowRev` is true), but *with* a `.min` extension added.  This won't add a min if there is one already.
* `package`: the Bower package name, as provided above.

#### options.files[ ].test

Type: `String`  
Default: (none)

If provided, this string will be evaluated within a javascript block.  If the result is truthy, then we assume the CDN 
resource loaded properly.  If it isn't, then the original local file will be loaded.

This snippet will be inserted *exactly* as provided.  If the package fails to load from the CDN, the global variable 
won't exist, so you need to check for it's existence on an *existing* global object. Usually this will be `window`, 
which you'll see through most of the examples here.  

When using a common public CDN, some popular packages come with fallback tests.

See the cdnizer [files options](https://github.com/OverZealous/cdnizer#optionsfiles).

## Changelog

To see the list of recent changes, see [Releases section](https://github.com/dakal-oleksandr/ember-cli-cdn/releases).

## Examples

See the [examples](https://github.com/dakal-oleksandr/ember-cli-cdn/blob/v2.1.0/ember-cli-build.js).

## License

MIT © Dakal Oleksandr
