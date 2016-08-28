'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');
var urls = require('./urls');

function kintone(domain, authorization) {
  var fullDomain = domain + '.cybozu.com';

  function requestBase(link, data, callback) {
    var method = link.pop();

    link.unshift(fullDomain, 'k', 'v1');

    var options = {
      url: 'https://' + link.join('/') + '.json',
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        'X-Cybozu-Authorization': authorization,
      },
      body: JSON.stringify(data)
    };

    request(options, function(err, response, body) {
      callback(err, response, JSON.parse(body));
    });
  }

  for (var i = 0; i < urls.length; ++i) {
    var link = urls[i].split('/');
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
          return function(data, callback) {
            return requestBase(linkStr, data, callback);
          };
        }(urls[i].split('/')));
      }
    }
  }

  kintone.prototype.file.post = function(filename, callback) {
    var options = {
      url: 'https://' + fullDomain + '/k/v1/file.json',
      headers: {
        'X-Cybozu-Authorization': authorization
      },
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

    request(options, function(err, response, body) {
      callback(err, response, JSON.parse(body));
    });
  };
}

module.exports = kintone;
