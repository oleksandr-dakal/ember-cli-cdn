# Ember-cli-cdn

Replacing links with CDN links, includes fallbacks, customization.

## Installation

To install as an Ember CLI addon:

`$ ember install ember-cli-cdn`

### Why to use

This plugin takes content of files and replace matched links by patterns to CDN links with a lot 
of options to customize output. 
Additionally it can exclude from concatenated vendor files and move them as separate link 
to template container.

### Usage

In index.html include container:

`{{content-for 'cdn'}}`

In Brocfile.js or ember-cli-build.js:

```
var app = new EmberApp({
  cdn: {
    enabled: true,
    // Options
    files: [{
      file: '**/jquery.*js',
      cdn: 'cdnjs:jquery'
    }]
  }
});
```

In result jQuery will be excluded from vendor.js file and included to html as 
separate tags that loads from CDN.

```
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js" data-original="assets/jquery-7decc060e1d33ab4c0ea42ed03d3d797.js"></script>

<script>if(!(window.jQuery)) cdnizerLoad("assets/jquery-7decc060e1d33ab4c0ea42ed03d3d797.js");</script>
```

## Options

### enabled

Define if plugin is enabled. By default plugin enabled with environment `production`.

### files

See the cdnizer [files options](https://github.com/OverZealous/cdnizer#optionsfiles).

## License

MIT © Dakal Oleksandr
