'use strict';

var express = require('express');
var app = express();
var controller = require('./app/controller');
var fs = require('fs');


app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  let user = '*****'
  let password = '*****'
  let host = 'imap.gmail.com'
  let pckg = fs.readFileSync('package.json');
  pckg = JSON.parse(pckg);

  let widget = {};
  widget._id = '1234567890';
  widget.size = pckg.smartmirror.size[0];

  controller.get({
      user: user,
      password: password,
      host: host
    })
    .then((data) => {
      res.render('./index.jade', {
        data: data,
        widget: widget,
      });
    });
});

app.listen(8080, function() {
  console.log('App listening on port 8080!');
});