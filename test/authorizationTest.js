'use strict';

var kintone = require('../lib');
var expect = require('chai').expect;
var nock = require('nock');

describe('authorization', function() {

  afterEach(function() {
    nock.cleanAll();
  });

  var username = 'alice';
  var password = 'password';
  var base64 = new Buffer(username + ':' + password).toString('base64');

  it('throws an error when no authorizations', function() {
    function fn() {
      new kintone('example');
    }

    expect(fn).to.throw(TypeError);
  })

  it('authenticates with base64 encoded authorization', function(done) {
    var scope = nock('https://example.cybozu.com', {
      reqheaders: {
        'X-Cybozu-Authorization': base64
      }
    }).get('/k/v1/app.json').reply(200, '{}');
    var api = new kintone('example', { authorization: base64 });

    api.app.get({}, function() {
      expect(scope.isDone()).to.be.true;
      done();
    });
  });

  it('authenticates with username and password', function(done) {
    var scope = nock('https://example.cybozu.com', {
      reqheaders: {
        'X-Cybozu-Authorization': base64
      }
    }).get('/k/v1/app.json').reply(200, '{}');
    var api = new kintone('example', {
      authorization: {
        username: username,
        password: password
      }
    });

    api.app.get({}, function() {
      expect(scope.isDone()).to.be.true;
      done();
    });
  });

  it('authorization with token', function(done) {
    var token = '0123456789abcdef';
    var scope = nock('https://example.cybozu.com', {
      reqheaders: {
        'X-Cybozu-API-Token': token
      }
    }).get('/k/v1/app.json').reply(200, '{}');
    var api = new kintone('example', {
      token: token
    });

    api.app.get({}, function() {
      expect(scope.isDone()).to.be.true;
      done();
    });
  });
});
