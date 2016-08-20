'use strict';

var request = require('request');
var fs = require('fs');
var path = require('path');

var apis = [
  'app/acl/get',
  'app/acl/put',
  'app/customize/get',
  'app/form/fields/get',
  'app/form/layout/get',
  'app/get',
  'app/settings/get',
  'app/views/get',
  'apps/get',
  'bulkRequest/post',
  'field/acl/get',
  'field/acl/put',
  'file/get',
  'file/post',
  'form/get',
  'guests/delete',
  'guests/post',
  'preview/app/acl/get',
  'preview/app/acl/put',
  'preview/app/customize/get',
  'preview/app/customize/put',
  'preview/app/deploy/get',
  'preview/app/deploy/post',
  'preview/app/form/fields/delete',
  'preview/app/form/fields/get',
  'preview/app/form/fields/post',
  'preview/app/form/fields/put',
  'preview/app/form/layout/get',
  'preview/app/form/layout/put',
  'preview/app/post',
  'preview/app/settings/get',
  'preview/app/settings/put',
  'preview/app/views/get',
  'preview/app/views/put',
  'preview/field/acl/get',
  'preview/field/acl/put',
  'preview/form/get',
  'preview/record/acl/get',
  'preview/record/acl/put',
  'record/acl/get',
  'record/acl/put',
  'record/assignees/put',
  'record/comment/delete',
  'record/comment/post',
  'record/comments/get',
  'record/get',
  'record/post',
  'record/put',
  'record/status/put',
  'records/delete',
  'records/get',
  'records/post',
  'records/put',
  'records/status/put',
  'space/body/put',
  'space/delete',
  'space/get',
  'space/guests/put',
  'space/members/get',
  'space/members/put',
  'space/thread/put',
  'template/space/post'
];

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
          return function(data, callback) {
            return requestBase(linkStr, data, callback);
          };
        }(apis[i].split('/')));
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
