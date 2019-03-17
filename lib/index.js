'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var apis = require('./apis').loadDefault();
var util = require('util');

function authFromOption(options) {
  var header = {};

  if (options.hasOwnProperty('oauthToken')) {
    header['Authorization'] = 'Bearer ' + options.oauthToken;
    return header;
  }

  var usernamePassword, base64;

  if (options.hasOwnProperty('basic')) {
    var basic = options.basic;

    if (typeof basic === 'string') {
      header['Authorization'] = 'Basic ' + basic;
    } else if (typeof basic === 'object') {
      if (basic.hasOwnProperty('username') && basic.hasOwnProperty('password')) {
        usernamePassword = basic.username + ':' + basic.password;
        base64 = Buffer.from(usernamePassword).toString('base64');

        header['Authorization'] = 'Basic ' + base64;
      }
    }
  }

  if (options.hasOwnProperty('token')) {
    header['X-Cybozu-API-Token'] = options.token;
  } else if (options.hasOwnProperty('authorization')) {
    var authorization = options.authorization;

    if (typeof authorization === 'string') {
      header['X-Cybozu-Authorization'] = authorization;
    } else if (typeof authorization === 'object') {
      if (authorization.hasOwnProperty('username') && authorization.hasOwnProperty('password')) {
        usernamePassword = authorization.username + ':' + authorization.password;
        base64 = Buffer.from(usernamePassword).toString('base64');

        header['X-Cybozu-Authorization'] = base64;
      }
    }
  }

  if (!header.hasOwnProperty('X-Cybozu-API-Token') && !header.hasOwnProperty('X-Cybozu-Authorization')) {
    throw new TypeError('Specify "token" or "authorization"');
  }
  return header;
}

function merge(source, target) {

  Object.keys(source).forEach(function(key) {
    target[key] = source[key];
  });
  return target;
}

function kintone(domain, authorization) {
  var authOption = authFromOption(authorization);

  // Add .cybozu.com if only sub-domain is specified.
  if (!domain.match('\\.')) {
    domain += '.cybozu.com';
  }

  function requestBase(link, data, callback) {
    var clonedLink = link.slice(0);
    var method = clonedLink.pop();

    clonedLink.unshift(domain, 'k', 'v1');

    var options = {
      url: 'https://' + clonedLink.join('/') + '.json',
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

    merge(authOption, options.headers);

    request(options, function(err, response, body) {
      callback(err, JSON.parse(body));
    });
  }

  for (var i = 0; i < apis.length; ++i) {
    var link = apis[i].split('/');
    var head = kintone.prototype;

    while (link.length !== 0) {
      var key = link.shift();

      if (!head.hasOwnProperty(key)) {
        head[key] = {};
      }
      if (link.length !== 0) {
        head = head[key];
      } else {
        head[key] = (function(linkStr) {
          Object.freeze(linkStr);
          return util.promisify(function(data, callback) {
            return requestBase(linkStr, data, callback);
          });
        }(apis[i].split('/')));
      }
    }
  }

  kintone.prototype.file.post = util.promisify(function(filename, callback) {
    var options = {
      url: 'https://' + domain + '/k/v1/file.json',
      method: 'POST',
      headers: {},
      formData: {
        file: {
          value: fs.createReadStream(filename),
          options: {
            filename: path.basename(filename),
            contentType: 'text/plain'
          }
        }
      }
    };

    merge(authOption, options.headers);

    request(options, function(err, response, body) {
      callback(err, JSON.parse(body));
    });
  });

  kintone.prototype.file.get = util.promisify(function(fileKey, callback) {
    var options = {
      url: 'https://' + domain + '/k/v1/file.json',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileKey: fileKey })
    };

    merge(authOption, options.headers);

    request(options, function(err, response, body) {
      callback(err, body);
    });
  });
}

module.exports = kintone;
