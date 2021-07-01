/*
 * Step 5. (5-1) Auth0에게 user profile 정보 조회 Lambda Function
 * 
 */

'use strict';

var jwt = require('jsonwebtoken');
var request = require('request');

exports.handler = function(event, context, callback){
    if (!event.authToken) {
    	callback('Could not find event.authToken OR abnormal token');
    	return;
    }

    var token = event.authToken.split(' ')[1];

    // bellow new buffer deprecated, maybe, buffer change from heapalloc to heapmanager
    //var secretBuffer = new Buffer(process.env.AUTH0_SECRET);
    var secretBuffer = Buffer.from(process.env.AUTH0_SECRET);
    jwt.verify(token, secretBuffer, function(err, decoded){
    	if(err){
    		console.log('Failed jwt verification: ', err, 'auth: ', event.authToken);
    		callback('Authorization Failed');
    	} else {

        var body = {
          'id_token': token
        };

        var options = {
          url: 'https://'+ process.env.DOMAIN + '/tokeninfo',
          method: 'POST',
          json: true,
          body: body
        };

        request(options, function(error, response, body){
          if (!error && response.statusCode === 200) {
            callback(null, body);
          } else {
            callback(error);
          }
        });
    	}
    })
};