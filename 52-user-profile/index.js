/**
 * Modified by CSDN, Auth0 new feature, Custom by Joe
 */


'use strict';

var jwt = require('jsonwebtoken');
var request = require('request');
var base64 = require('base64url');


exports.handler = function(event, context, callback){
  if (!event.authToken) {
    callback('UserProfile Error: Could not find authToken');
    return;
  }

  var id_Token = event.authToken.split(' ')[1];
  var access_Token = event.authToken.split(' ')[2]
  var decoded = base64.decode(id_Token);

  console.log("JOE1: event: ", JSON.stringify(event));
  console.log("JOE1: id_token: ", id_Token);
  console.log("JOE1: access_token: " + access_Token);
  console.log("JOE1: id_token Decoded: " + decoded);

  var pem = "-----BEGIN CERTIFICATE-----\n" + process.env.PEM + "\n-----END CERTIFICATE-----";

  var body = {
    //'id_token': id_token,
    //'access_token': access_token
  };
  var options = {
    headers: {
      Authorization: 'Bearer ' + access_Token
    },
    url: 'https://'+ process.env.DOMAIN + '/userinfo',
    method: 'POST',
    json: true,
    body: body
  };

  console.log("JOE2:", body, "::", options, "::end");
  //var secretBuffer = new Buffer(process.env.AUTH0_SECRET);

  jwt.verify(id_Token, pem, function(err, decoded){
    if(err){
      console.log('JOE3: Failed jwt verification: ', err, 'event.authToken: ', event.authToken);
      callback('JOE3: Authorization Failed: ');
    } else {
      console.log('JOE4: Success jwt verification: ', id_Token, ":with options:" + JSON.stringify(options));
    
      request(options, function(error, response, body){
        if (!error && response.statusCode === 200) {
          console.log("JOEX1-response: " + JSON.stringify(response));
          console.log("JOEX1-OK-body: " + JSON.stringify(body));
          callback(null, body);
        } else {
          console.log("JOEX2-Bad-Response: " + error + "::" + JSON.stringify(response));
          callback(error);
        } // fi

      }); // request
    } // fi
  }) // jwt.verify
};
