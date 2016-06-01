'use strict';

var express = require('express');
var app = express();
var util = require('util');
var controller = require('./app/controller');


app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  let user = '******************'
  let password = '******************'
  let host = 'imap.gmail.com'

  controller.get({
      user: user,
      password: password,
      host: host
    })
    .then((mails) => {
      res.render('app/view.jade', {
        title: 'Mail Information',
        mails: mails
      });
    });
});

app.listen(8080, function() {
  console.log('App listening on port 8080!');
});