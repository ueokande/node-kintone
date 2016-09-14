Node-kintone
============

A Node.js wrapper for kintone API.

Installation
------------

Install via [npm](https://www.npmjs.com/package/kintone)

```
npm install kintone
```

Usage
-----

The following example fetches the information of an app by API token:

```javascript
var kintone = require('kintone');

var token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var api = new kintone('example.cybozu.com', { token: token });
api.app.get({ id: 1 }, function(err, response) {
    console.log(response);
});
```

Authorization by username and password is also allowed:

```javascript
var api = new kintone('example.cybozu.com', {
    authorization: {
      username: "XXXXXXXX",
      password: "XXXXXXXX"
    }
});
```

API Documentation
-----------------

- [cybozu developer network](https://cybozudev.zendesk.com/)

LICENSE
-------

MIT

