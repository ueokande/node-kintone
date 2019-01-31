'use strict';

var kintone = require('../lib');
var expect = require('chai').expect;
var nock = require('nock');

describe('promise', function() {

  afterEach(function() {
    nock.cleanAll();
  });

  it('returns promise when no callback is provided', function(done) {
    var scope = nock('https://example.cybozu.com').get('/k/v1/app.json').reply(200, '{}');
    var api = new kintone('example', { 'token': 'loremipsum' });

    api.app.get({}).then(function() {
      expect(scope.isDone()).to.be.true;
      done();
    });
  });
});
