[![CircleCI](https://circleci.com/gh/ueokande/node-kintone.svg?style=svg)](https://circleci.com/gh/ueokande/node-kintone)
[![npm version](https://badge.fury.io/js/kintone.svg)](https://badge.fury.io/js/kintone)

Node-kintone
============

A Node.js wrapper for kintone API.

Installation
------------

Install via [npm](https://www.npmjs.com/package/kintone)

```
npm install kintone
```

Getting Started
---------------

The following example fetches the information of an app by API token:

```javascript
// import 'kintone' module
var kintone = require('kintone');

// Access Kintone API on 'example.cybozu.com' with username/password
var api = new kintone('example.cybozu.com', {
  authorization: {
    username: "XXXXXXXX",
    password: "XXXXXXXX"
  }
});

// Get records of app 1
api.records.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

### Promise and callback

The API results are returned asynchronously.  Both callback-style and promise-style are supported.

```javascript
// Get records of app 1 via callback
api.records.get({ app: 1 }, function(err, response) {
  if (err) throw err
  console.log(response);
});

// Get records of app 1 with Promise
api.records.get({ app: 1 }).then(function (response) {
  console.log(response);
}).catch(function (err) {
  // Handle err
});

// Get records of app 1 with await/async (ES7)
try {
  let response = await api.records.get({ app: 1 });
  console.log(response);
} catch (err) {
  // Handle err
}
```

### Authentication


Authorization with [User authentication][User authentication en]([ja][User authentication ja]):

```javascript
var api = new kintone('example.cybozu.com', {
  authorization: {
    username: "XXXXXXXX",
    password: "XXXXXXXX"
  }
});
```

Authorization with Basic authentication:

```javascript
var api = new kintone('example.cybozu.com', {
  authorization: {
    username: "XXXXXXXX",
    password: "XXXXXXXX"
  },
  basic: {
    username: "YYYYYYYY",
    password: "YYYYYYYY",
  }
});
```

Authorization with [API Token authentication][API Token authentication en]([ja][API Token authentication ja]):

```javascript
var token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var api = new kintone('example.cybozu.com', { token: token });
```

Authorization with [OAuth token][OAuth en] ([ja][OAuth ja]):

```javascript
var oauthToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
var api = new kintone('example.cybozu.com', { oauthToken: oauthToken });
```

### App APIs

Get information of an app:

```javascript
api.app.get({ id: 200 }, function(err, response) {
  console.log(response);
});
```

Get information of apps:

```javascript
api.apps.get({}, function(err, response) {
  console.log(response);
});
```

Update information of an app:

```javascript
api.preview.app.post({ name: "APP_NAME" }, function(err, response) {
  console.log(response);
});
```

Deploy the preview app:

```javascript
api.preview.app.deploy.post({ apps: [{ app: 1 }] }, function(err, response) {
  console.log(response);
});
```

Get the status of the preview apps:

```javascript
api.preview.app.deploy.get({ apps: [100, 110] }, function(err, response) {
  console.log(response);
});
```

Get the fields of an app:

```javascript
api.app.form.fields.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the fields of a preview app:

```javascript
api.preview.app.form.fields.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Create fields of a preview app:

```javascript
var params = {
  app: 1,
  properties: {
    "Text__single_line_1": {
      type: "SINGLE_LINE_TEXT",
      code: "Text__single_line_1",
      label: "Name"
    },
    "Number": {
      type: "NUMBER",
      code: "Number",
      label: "Age"
    }
  }
};
api.preview.app.form.fields.post(params, function(err, response) {
  console.log(response);
});
```

Update the fields of a preview app:

```javascript
var params = {
  app: 1,
  rights: [
    {
      filterCond: "Created_datetime > \"2011-11-07T09: 00: 00Z\"",
      code: "Text__single_line_1",
      entities: [
        {
          entity: { type: "ORGANIZATION", code: "org1" },
          accessibility: "READ",
        },
        {
          entity: { type: "GROUP", code: "everyone" },
          accessibility: "NONE",
        }
      ]
    }
  ]
};
api.preview.app.form.fields.put(params, function(err, response) {
  console.log(response);
});
```

Delete the fields of a preview app:

```javascript
api.preview.app.form.fields.delete({ app: 1, fields: ["Text__single_line_1"] }, function(err, response) {
  console.log(response);
});
```

Get the field layout of of an app:

```javascript
api.app.form.layout.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the field layout of of a preview app:

```javascript
api.preview.app.form.layout.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Update the field layout of of a preview app:

```javascript
var params = {
  app: 1,
  layout: [
    {
      type: "ROW",
      fields: [
        {
          type: "SINGLE_LINE_TEXT",
          code: "Text__single_line_1",
          size: { width: 250 }
        }
      ]
    }
  ]
};
api.preview.app.form.layout.put(params, function(err, response) {
  console.log(response);
});
```

Get the view of an app:

```javascript
api.app.views.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the view of a preview app:

```javascript
api.preview.app.views.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Update the view of a preview app:

```javascript
var params = {
  app: 1,
  views: {
    "My List View": {
      index: 0,
      type: "LIST",
      name: "My List View",
      fields: [
        "Record_number",
        "Text__single_line_1"
      ],
      filterCond: "Updated_datetime > LAST_WEEK()",
      sort: "Record_number asc"
    },
    "(Assigned to me)": {
      index: 3,
      type: "LIST"
    }
  }
};
api.preview.app.views.put(params, function(err, response) {
  console.log(response);
});
```

Update the settings of an app:

```javascript
api.app.settings.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Update the settings of a preview app:

```javascript
api.preview.app.settings.put({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the process management of an app.:

```javascript
api.app.status.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the process management of an app.:

```javascript
api.preview.app.status.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Update the process management of an app.:

```javascript
api.preview.app.status.put({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the customize of an app:

```javascript
api.app.customize.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the customize of a preview app:

```javascript
api.preview.app.customize.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Update the customize of a preview app:

```javascript
api.preview.app.customize.put({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the permissions of an app:

```javascript
api.app.acl.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the permissions of a preview app:

```javascript
api.preview.app.acl.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Update the permissions of an app:

```javascript
var params = {
  app: 1,
  rights: [
    {
      filterCond: "Created_datetime > \"2011-11-07T09:00:00Z\"",
      entity: { type: "CREATOR" },
      appEditable: true,
      recordViewable: true,
      recordAddable: true,
      recordEditable: true,
      recordDeletable: true
    },
    {
      entity: { type: "GROUP", code: "everyone" },
      recordViewable: true,
      recordAddable: true
    }
  ]
};
api.app.acl.put(params, function(err, response) {
  console.log(response);
});
```

Update the permissions of a preview app:

```javascript
var params = {
  app: 1,
  rights: [
    {
      filterCond: "Created_datetime > \"2011-11-07T09:00:00Z\"",
      entity: { type: "CREATOR" },
      appEditable: true,
      recordViewable: true,
      recordAddable: true,
      recordEditable: true,
      recordDeletable: true
    },
    {
      entity: { type: "GROUP", code: "everyone" },
      recordViewable: true,
      recordAddable: true
    }
  ]
};
api.preview.app.acl.put(params, function(err, response) {
  console.log(response);
});
```

Get the record permissions of an app:

```javascript
api.record.acl.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the record permissions of a preview app:

```javascript
api.preview.record.acl.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Update the record permissions of an app:

```javascript

var params = {
  app: 1,
  rights: [
    {
      filterCond: "Created_datetime > \"2011-11-07T09:00:00Z\"",
      entities: [
        {
          entity: { type: "ORGANIZATION", code: "org1" },
          viewable: false,
          editable: false,
          deletable: false,
          includeSubs: true
        }
      ]
    }
  ]
};
api.record.acl.put(params, function(err, response) {
  console.log(response);
});
```

Update the record permissions of a preview app:

```javascript
var params = {
  app: 1,
  rights: [
    {
      filterCond: "Created_datetime > \"2011-11-07T09:00:00Z\"",
      entities: [
        {
          entity: { type: "ORGANIZATION", code: "org1" },
          viewable: false,
          editable: false,
          deletable: false,
          includeSubs: true
        }
      ]
    }
  ]
};
api.preview.record.acl.put(params, function(err, response) {
  console.log(response);
});
```

Get the field permissions of an app:

```javascript
api.field.acl.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the field permissions of a preview app:

```javascript
api.preview.field.acl.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Update the field permissions of an app:

```javascript
var params = {
  app: 1,
  rights: [
    {
      filterCond: "Created_datetime > \"2011-11-07T09: 00: 00Z\"",
      code: "Text__single_line_1",
      entities: [
        {
          entity: { type: "ORGANIZATION", code: "org1" },
          accessibility: "READ",
        },
        {
          entity: { type: "GROUP", code: "everyone" },
          accessibility: "NONE",
        }
      ]
    }
  ]
};
api.field.acl.put(params, function(err, response) {
  console.log(response);
});
```

Update the field permissions of a preview app:

```javascript
var params = {
  rights: [
    {
      filterCond: "Updated_datetime > \"2012-02-03T09: 00: 00Z\" and Updated_datetime < \"2012-02-03T10: 00: 00Z\"",
      entities: [
        {
          entity: { type: "ORGANIZATION", code: "org1" },
          viewable: false,
          editable: false,
          deletable: false,
          includeSubs: true
        },
        {
          entity: { type: "FIELD_ENTITY", code: "Updated_by" },
          viewable: true,
          editable: true,
          deletable: true
        }
      ]
    }
  ]
};
api.preview.field.acl.put(params, function(err, response) {
  console.log(response);
});
```

Evaluate the record permission:

```javascript
api.records.acl.evaluate.get({ app: 1, ids: [1, 2] }, function(err, response) {
  console.log(response);
});
```

Get the form informations of an app:

```javascript
api.form.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Get the form informations of a preview app:

```javascript
api.preview.form.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

### Record APIs

Get the record of an app:

```javascript
api.record.get({ app: 1, id: 200 }, function(err, response) {
  console.log(response);
});
```

Get multiple records of an app:

```javascript
api.records.get({ app: 1 }, function(err, response) {
  console.log(response);
});
```

Create a record of an app:

```javascript
var params = {
  app: 1,
  record: {
    "Text__single_line_1": { value: "Hello!" },
  }
}
api.record.post(params, function(err, response) {
  console.log(response);
});
```

Create multiple records of an app:

```javascript
var params = {
  app: 1,
  records: [
    {
      "Text__single_line_1": { value: "Apple" },
    },
    {
      "Text__single_line_1": { value: "Banana" },
    }
  ]
};
api.records.post(params, function(err, response) {
  console.log(response);
});
```

Update the record of an app:

```javascript
var params = {
  app: 1,
  id: 1,
  record: {
    "Text__single_line_1": { value: "Good morning!" },
  }
}
api.record.put(params, function(err, response) {
  console.log(response);
});
```

Update the records of an app:

```javascript
var params = {
  app: 1,
  records: [
    {
      id: 5,
      record: {
        "Text__single_line_1": { value: "Cherry" },
      }
    },
    {
      id: 6,
      record: {
        "Text__single_line_1": { value: "Grape" },
      }
    }
  ]
};
api.records.put(params, function(err, response) {
  console.log(response);
});
```

Delete the records of an app:

```javascript
api.records.delete({ app: 1, ids: [1, 2] }, function(err, response) {
  console.log(response);
});
```

Get the record comments of an app:

```javascript
api.record.comments.get({ app: 1, record: 10 }, function(err, response) {
  console.log(response);
});
```

Create a record comment of an app:

```javascript
var params = {
  app: 1,
  record: 10,
  comment: { text: "Good morning!" }
};
api.record.comment.post(params, function(err, response) {
  console.log(response);
});
```

Delete a record comment of an app:

```javascript
api.record.comment.delete({ app: 1, record: 10, comment: 20 }, function(err, response) {
  console.log(response);
});
```

Download a file:

```javascript
api.file.get("20190317023231CD83EE9D811A40EE92F3515DD6213F54100", function(err, response) {
  console.log(response);
});
```

Upload a file:

```javascript
api.file.post('/tmp/my-file.txt', function(err, response) {
  console.log(response)
});
```

Execute multiple API requests:

```javascript
var params = {
  requests: [
    {
      method: "POST",
      api: "/k/v1/record.json",
      payload: {
        app: 1,
        record: {
          "Text__single_line_1": { value: "Delete logs" }
        }
      }
    },
    {
      method: "DELETE",
      api: "/k/v1/records.json",
      payload: {
        app: 2,
        ids: [10, 11]
      }
    }
  ]
};
api.bulkRequest.post(params, function(err, response) {
  console.log(response);
});
```

Update status of a record:

```javascript
api.record.status.put({ app: 1, id: 10, action: "Submit" }, function(err, response) {
  console.log(response);
});
```

Update status of records:

```javascript
var params = {
  app: 1,
  records: [
    { "id": 11, "action": "Submit", "assignee": "alice" },
    { "id": 12, "action": "Cancel" }
  ]
};
api.records.status.put(params, function(err, response) {
  console.log(response);
});
```

Update assignees of a record:

```javascript
api.record.assignees.put({ app: 1, id: 10, assignees: ["bob"] }, function(err, response) {
  console.log(response);
});
```

### Space APIs

Get a space:

```javascript
api.space.get({ id: 200 }, function(err, response) {
  console.log(response);
});
```

Create a space from space template:

```javascript
var params = {
  id: 1,
  name: "My Space",
  members: [
    {
      "entity": {
        "type": "USER",
        "code": "alice"
      },
      "isAdmin": true
    },
    {
      "entity": {
        "type": "ORGANIZATION",
        "code": "org1"
      },
      "includeSubs": true
    }
  ]
}
api.template.space.post(params, function(err, response) {
  console.log(response);
});
```

Update the body of a space:

```javascript
api.space.body.put({ id: 200, body: "<b>Sample Space Description</b>" }, function(err, response) {
  console.log(response);
});
```

Delete a space:

```javascript
api.space.delete({ id: 200 }, function(err, response) {
  console.log(response);
});
```

Get the members of a space:

```javascript
api.space.members.get({ id: 200 }, function(err, response) {
  console.log(response);
});
```

Update the member of a space:

```javascript
var params = {
  id: 4,
  members: [
    {
      "entity": {
        "type": "USER",
        "code": "alice"
      },
      "isAdmin": true
    },
    {
      "entity": {
        "type": "ORGANIZATION",
        "code": "org1"
      },
      "includeSubs": true
    }
  ]
}
api.space.members.put(params, function(err, response) {
  console.log(response);
});
```

Create a thread comment of a space:

```javascript
var params = {
  space: 1,
  thread: 10,
  comment: {
    "text": "Hello, everyone!",
  }
};
api.space.thread.comment.post(params, function(err, response) {
  console.log(response);
});
```

Create a thread of a space:

```javascript
var params = {
  id: 9,
  name: "Self-introduction",
  body: "<b>Welcome!</b>"
};
api.space.thread.put(params, function(err, response) {
  console.log(response);
});
```

Add guest users:

```javascript
api.guests.post({ guests: ["guest1@example.com", "guest2@example.com"] }, function(err, response) {
  console.log(response);
});
```

Update the guest members of a space:

```javascript
api.space.guests.put({ id: 1, guests: ["guest1@example.com", "guest2@example.com"] }, function(err, response) {
  console.log(response);
});
```

Delete guest users:

```javascript
api.guests.delete({ guests: ["guest1@example.com", "guest2@example.com"] }, function(err, response) {
  console.log(response);
});
```

API Documentation
-----------------

- [cybozu developer network in Japanese](https://developer.cybozu.io/)
- [Kintone Devekiper Program](https://developer.kintone.io/)

LICENSE
-------

MIT

[API Token authentication en]: https://developer.kintone.io/hc/en-us/articles/229868687-Using-API-Token-authentication
[API Token authentication ja]: https://developer.cybozu.io/hc/ja/articles/202463840-API%E3%83%88%E3%83%BC%E3%82%AF%E3%83%B3%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86
[User authentication en]: https://developer.cybozu.io/hc/ja/articles/201941754-kintone-REST-API%E3%81%AE%E5%85%B1%E9%80%9A%E4%BB%95%E6%A7%98#step7
[User authentication ja]: https://developer.kintone.io/hc/en-us/articles/115008478208-User-API-Overview#userauthentication
[OAuth en]: https://developer.kintone.io/hc/en-us/articles/360001562353-How-to-add-OAuth-clients-%CE%B2-
[OAuth ja]: https://developer.cybozu.io/hc/ja/articles/360015955171-OAuth%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88%E3%81%AE%E4%BD%BF%E7%94%A8-%CE%B2-
