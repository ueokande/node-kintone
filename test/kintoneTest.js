"use strict";

var kintone = require("../lib");
var expect = require("chai").expect;

describe("kintone class", function() {
  var api;

  beforeEach(function() {
    api = new kintone("example", "auth");
  });

  it("has method", function() {
    expect(api.app.get instanceof Function).to.be.true;
  });
});
