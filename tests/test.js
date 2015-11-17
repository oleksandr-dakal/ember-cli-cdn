var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var cp = require('child_process');
var expect = require('chai').expect;

describe('Utils', function () {
  var Util = require('./../util/util.js');

  it('have htmlTag method', function () {
    expect(Util.htmlTag).to.be.a('function');
  });

  it('have extractItems method', function () {
    expect(Util.extractItems).to.be.a('function');
  });

  it('have filterLinks method', function () {
    expect(Util.filterLinks).to.be.a('function');
  });

  describe('htmlTag', function () {

    it('return script tag', function () {
      var file = 'script.js',
        tag = Util.htmlTag(file);

      expect(tag).to.match(/^<script+.*/);
      expect(tag).to.match(/.*script>$/);
      expect(tag).to.match(new RegExp('.*src="' + file + '".*'));
    });

    it('return style tag', function () {
      var file = 'style.css',
        tag = Util.htmlTag(file);

      expect(tag).to.match(/^<link+.*/);
      expect(tag).to.match(/.*rel="stylesheet".*/);
      expect(tag).to.match(new RegExp('.*href="' + file + '".*'));
    });

    it('return empty string if extension is not supported', function () {
      var tag = Util.htmlTag('test.jsxx');

      expect(tag).to.be.equal('');
    });

    it('throw error if parameter is not string', function () {
      expect(Util.htmlTag).to.throw(Error);
    });

  });

  describe('extractItems', function () {
    var arr = ['item1', 'item2'],
      ext = Util.extractItems(arr, ['*2']);

    it('return extracted items', function () {
      expect(ext).to.be.an('array');
      expect(ext).to.include('item2');
      expect(ext).to.have.length(1);
    });

    it('mutate array', function () {
      expect(arr).to.be.an('array');
      expect(arr).to.include('item1');
      expect(arr).to.have.length(1);
    });

    it('throw error at least one of parameters is not an array',
      function () {
        expect(Util.extractItems).to.throw(Error);
      });

  });

  describe('filterLinks', function () {
    var arr = ['item1.js', 'item2.css'];

    it('filter script links', function () {
      var res = Util.filterLinks(arr, 'scripts');

      expect(res).to.be.an('array');
      expect(res).to.include('item1.js');
      expect(res).to.have.length(1);
    });

    it('filter styles links', function () {
      var res = Util.filterLinks(arr, 'styles');

      expect(res).to.be.an('array');
      expect(res).to.include('item2.css');
      expect(res).to.have.length(1);
    });
  });

});

describe('Html output', function () {
  var outPath = path.join(__dirname, '_tmp');

  before(function (done) {
    this.timeout(30000);

    cp.execSync('ember build --output-path="' + outPath +
      '" --environment=production');
    done();
  });

  after(function () {
    rimraf.sync(outPath);
  });

  it('contain cdn links', function () {
    var indexHtml = fs.readFileSync(path
      .join(outPath, 'index.html'), 'utf-8');

    expect(indexHtml).to.match(/.*src=".*jquery.*1\.11\.3.*\.js".*/);
  });
});
