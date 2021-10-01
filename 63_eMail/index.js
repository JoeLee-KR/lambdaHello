'use strict';
var AWS = require('aws-sdk');
var email = require('./lib/email');
//const email = require('./lib/email');

exports.handler = function(event, context, callback){
    console.log('0x63: handler in.');
    email.send( ['xjoelee@gmail.com'], 'xjoelee@gmail.com', 'mySubject', 'myBody' );
    console.log('0x63: handler out.');
};
