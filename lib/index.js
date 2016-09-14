'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var apis = require('./apis');

function authFromOption(options) {
  if (options.hasOwnProperty('token')) {
    return { 'X-Cybozu-API-Token': options.token };
  } else if (options.hasOwnProperty('base64')) {
    return { 'X-Cybozu-Authorization': options.base64 };
  } else if (options.hasOwnProperty('username') &&
             options.hasOwnProperty('password')) {
    var usernamePassword = options.username + ':' + options.password;
    var base64 = new Buffer(usernamePassword).toString('base64');

    return { 'X-Cybozu-Authorization': base64 };
  }
  throw new TypeError('Specify "token", "base64" or "username" and "password"');
}

function kintone(domain, authorization) {
  var authOption = authFromOption(authorization);
  var authOptionKey = Object.keys(authOption)[0];
  var authOptionValue = authOption[authOptionKey];

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

    options.headers[authOptionKey] = authOptionValue;

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
          return function(data, callback) {
            return requestBase(linkStr, data, callback);
          };
        }(apis[i].split('/')));
      }
    }
  }

  kintone.prototype.file.post = function(filename, callback) {
    var options = {
      url: 'https://' + domain + '/k/v1/file.json',
      headers: {},
      method: 'POST',
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

    options.headers[authOptionKey] = authOptionValue;

    request(options, function(err, response, body) {
      callback(err, JSON.parse(body));
    });
  };
}

module.exports = kintone;
