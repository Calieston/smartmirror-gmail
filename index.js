'use strict';

var express = require('express');
var app = express();

var controller = require('./app/controller');

app.locals.moment = require('moment');

app.set('views', __dirname);
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  let user = '**********'
  let clientId = '**********'
  let clientSecret = '**********'
  let refreshToken = '**********'
  let accessToken = '**********'

  controller.get({
      user: user,
      clientId: clientId,
      clientSecret: clientSecret,
      refreshToken: refreshToken,
      accessToken: accessToken,
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