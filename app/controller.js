'use strict';
var Imap = require('imap'),
  util = require('util'),
  MailParser = require("mailparser").MailParser;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.get = function(params) {
  // Return new Promise
  return new Promise((resolve, reject) => {
    let user = params.user
    let password = params.password
    let host = params.host
    const mailData = []

    var imap = new Imap({
      user: user,
      password: password,
      host: host,
      port: 993,
      tls: true,
      authTimeout: 3000
    });

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    // create a connection
    imap.connect();

    // handle connection error event
    imap.once('error', function(err) {
      console.log(err);
    });

    // handle disconnect event
    imap.once('end', function() {
      console.log('Connection ended');
    });

    // call execute function after established connection
    imap.once('ready', execute);

    function execute() {
      openInbox(function(err, box) {
        if (err) throw err;
        imap.search(['UNSEEN', ['SINCE', 'May 29, 2016']], function(err, results) {
          if (err) throw err;
          var f = imap.fetch(results, {
            bodies: ["HEADER.FIELDS (FROM SUBJECT)", ""]
          });
          if (err) throw err;

          f.on("message", processMessage);
          f.once('error', function(err) {
            console.log('Fetch error: ' + err);
          });
          f.once('end', function() {
            // return mail array
            resolve(mailData);
          });
        });
      });
    };

    // parse mail body with mail parser
    function processMessage(msg, seqno) {
      var parser = new MailParser();
      /*      parser.on("headers", function(headers) {});*/
      parser.on("end", function(msg) {
        // add parsed mail into mail array
        mailData.push(msg);
      });

      msg.on("body", function(stream) {
        stream.on("data", function(chunk) {
          parser.write(chunk.toString("utf8"));
        });
      });
      msg.once("end", function() {
        parser.end();
      });
    }
  });

};