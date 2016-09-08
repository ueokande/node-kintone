'use strict';

var kintone = require('../lib');
var expect = require('chai').expect;
var nock = require('nock');

describe('kintone class', function() {

  afterEach(function() {
    nock.cleanAll();
  });

  it('has a method', function() {
    var api = new kintone('example', { 'token': 'loremipsum' });

    expect(api.app.get instanceof Function).to.be.true;
  });

  it('accesses .cybozu.com by abbreviated domain', function(done) {
    var scope = nock('https://example.cybozu.com').get('/k/v1/app.json').reply(200, '{}');
    var api = new kintone('example', { 'token': 'loremipsum' });

    api.app.get({}, function() {
      expect(scope.isDone()).to.be.true;
      done();
    });
  });

  it('accesses .cybozu.net by full domain', function(done) {
    var scope = nock('https://example.cybozu.net').get('/k/v1/app.json').reply(200, '{}');
    var api = new kintone('example.cybozu.net', { 'token': 'loremipsum' });

    api.app.get({}, function() {
      expect(scope.isDone()).to.be.true;
      done();
    });
  });
});
