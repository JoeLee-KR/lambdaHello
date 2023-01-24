/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 * Modified by Maxim Makatchev on January 7, 2018 
 * sdfdsfdsfdsf
 */

'use strict';

var jwt = require('jsonwebtoken');
var request = require('request');
 
exports.handler = function(event, context, callback){
    if (!event.authToken) {
        callback('Could not find authToken');
        return;
    }

    var id_token = event.authToken.split(' ')[1];
    var access_token = event.access_token;

    console.log("JOE1:", id_token, "::", access_token, "::", event, "::", JSON.stringify(event), "::end");

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
    console.log("JOE2:", body, "::", options, "::end");

    var secretBuffer = new Buffer(process.env.AUTH0_SECRET);
    //var secretBuffer = Buffer.from(process.env.AUTH0_SECRET);
    jwt.verify(id_token, secretBuffer, function(err, decoded){
        if(err){
            console.log('JOE3: Failed jwt verification: ', err, 'auth: ', event.authToken);
            callback('JOE3: Authorization Failed: ' + id_token + ", error: " + err + ", auth: " + event.authToken);
        } else {
            request(options, function(error, response, body){
                console.log("JOEX1: " + JSON.stringify(response));
                if (!error && response.statusCode === 200) {
                    console.log("JOEX2: " + JSON.stringify(response));
                    callback(null, body);
                } else {
                    callback(error);
                }
            });
        }
    })
};