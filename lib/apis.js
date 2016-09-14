'use strict';

var fs = require('fs');
var path = require('path');

var apisJson = fs.readFileSync(path.resolve(__dirname, 'apis.json'), 'UTF-8');
var apis = JSON.parse(apisJson).apis;

module.exports = Object.keys(apis);
