'use strict';

var fs = require('fs');
var path = require('path');

var apis = {};

apis.loadDefault = function() {
  var apisPath = path.resolve(__dirname, 'default-apis.json');

  return apis.loadFromFile(apisPath);
};

apis.loadFromFile = function(apisPath) {
  var apisJson = fs.readFileSync(apisPath, 'UTF-8');

  return Object.keys(JSON.parse(apisJson).apis);
};

module.exports = apis;
