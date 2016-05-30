'use strict';
var inbox = require("inbox");
var util = require("util");

exports.get = function(params) {
  // Return new Promise
  return new Promise((resolve, reject) => {

    let user = params.user
    let clientId = params.clientId
    let clientSecret = params.clientSecret
    let refreshToken = params.refreshToken
    let accessToken = params.accessToken
    let numberOfMails
    let mails = [];

    var client = inbox.createConnection(false, "imap.gmail.com", {
      secureConnection: true,
      auth: {
        XOAuth2: {
          user: user,
          clientId: clientId,
          clientSecret: clientSecret,
          refreshToken: refreshToken,
          accessToken: accessToken,
          timeout: 3600
        }
      }
    });

    // connect to mail account
    client.connect();

    // handle connection error event
    client.on("error", function(err) {
      console.log('Connection Error: ' + err)
    });

    // continue after getting connected event
    client.on("connect", function() {
      console.log('connected');
      // open mail inbox
      client.openMailbox("INBOX", function(error, info) {
        if (error) throw error;
        // get total number of mail inbox
        numberOfMails = info.count
        console.log("Total number of inbox mails: " + numberOfMails);
        // list newest 5 mails of inbox
        client.listMessages(-10, function(err, messages) {
          var stringify = JSON.stringify(messages)
          var mails = JSON.parse(stringify);
          resolve(mails);
        });

        // close connection to mail inbox
        client.close();
      });
    });

    // handle disconnection event
    client.on("close", function(err) {
      console.log('Disconnected')
    });
  });

};