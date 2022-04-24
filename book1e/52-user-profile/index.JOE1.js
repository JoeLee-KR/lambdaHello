/*
 * Step 5. (5-1) Auth0에게 user profile 정보 조회 Lambda Function
 * neo
 */

'use strict';

var request = require('request');
var jwt = require('jsonwebtoken');

exports.handler = function(event, context, callback){
    // check values
    console.log('JOE1:: ',  JSON.stringify(event), '::', JSON.stringify(event.authToken), '::', JSON.stringify(context), '::', process.env.DOMAIN, '::', process.env.AUTH0_SECRET, '::end::')
    
    if (!event.authToken) {
      console.log('JOE2:: ', JSON.stringify(event), '::', JSON.stringify(event.authToken), '::', JSON.stringify(context), '::', process.env.DOMAIN, '::', process.env.AUTH0_SECRET, '::end::')
    	callback('JOE2callback:: Could not find event.authToken:' + JSON.stringify(event) + '::' + JSON.stringify(event.authToken) + '::' + JSON.stringify(context)+ '::'+ process.env.DOMAIN+ '::'+ process.env.AUTH0_SECRET+ '::end::' );
    	return;
    }

    var id_token = event.authToken.split(' ')[1];
    var access_token = event.access_token;

    // var secretBuffer = new Buffer(process.env.AUTH0_SECRET);
    // new Buffer deprecated ?
    var secretBuffer = new Buffer(process.env.AUTH0_SECRET);
    var secretBuffer2 = Buffer.from(process.env.AUTH0_SECRET, 'base64');
    // check values
    console.log('JOE3:: ', id_token, 'Acces_token:', access_token, ':SECRET:', secretBuffer, '::', secretBuffer2, '::end::');

    var body = {
      'id_token': id_token,
      'access_token': access_token
    };

    var options = {
      url: 'https://'+ process.env.DOMAIN + '/userinfo',
      method: 'GET',
      json: true,
      body: body
    };
    // check values
    console.log('JOE4:: ', JSON.stringify(body), '::', JSON.stringify(options), "::end::" );

    jwt.verify(id_token, process.env.AUTH0_SECRET, function(err, decoded){
      // check values
      console.log('JOE5:: ', JSON.stringify(id_token), ':SECRET:', process.env.AUTH0_SECRET, '::', JSON.stringify(decoded), '::end::');
 
    	if(err){
        // check values
    		console.log('JOE6 Fail:: ', err, 'auth: ', event.authToken);
    		callback('JOE6:: Authorization Failed:', err, 'auth: ', event.authToken );
    	} else {   
        // check values
        console.log('JOE7::ready request with jwt : ', JSON.stringify(body), '::', JSON.stringify(options), "::" );

        request(options, function(error, response, body){
          console.log("JOEx1: " + JSON.stringify(response));
          if (!error && response.statusCode === 200) {
            console.log("JOEx2: " + JSON.stringify(response));
            callback(null, body);
          } else {
            callback(error);
          }
        });

    	} // fielse
    }) // jwt.verify

}; // handle