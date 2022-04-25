/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';

var jwt = require('jsonwebtoken');
var request = require('request');
var base64 = require('base64url');
exports.handler = function (event, context, callback) {
  if (!event.authToken) {
    callback('Could not find authToken');
    return;
  }
  console.log("EVENT:" + event.authToken);
  var idToken = event.authToken.split(' ')[1];
  var accessToken = event.authToken.split(' ')[2]
  var decoded = base64.decode(idToken);
  console.log("accessToken is:" + accessToken);
  console.log("idToken:" + idToken);
  console.log("ID idToken decoded:\n"+decoded);
  var pem = "-----BEGIN CERTIFICATE-----\n" + process.env.PEM + "\n-----END CERTIFICATE-----";
  jwt.verify(idToken, pem, function (err, decoded) {
    if (err) {
      console.log('Failed jwt verification: ', err, 'auth: ', event.authToken);
      callback('Authorization Failed');
    } else {
      console.log("SUCCESS: Verified");
      var body = {

      };

      var options = {
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        url: 'https://' + process.env.DOMAIN + '/userinfo',
        method: 'POST',
        json: true,
        body: body
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log(JSON.stringify(body));
          callback(null, body);
        } else {
          console.log("Bad response:\n" + JSON.stringify(error));
          callback(error);
        }
      });
    }
  })
};
