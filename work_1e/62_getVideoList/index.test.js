'use strict'; 

var AWS = require('aws-sdk');
var async = require('async');

var s3 = new AWS.S3();

exports.handler = function(event, context, callback){
  console.log('61_getVideoList: handler on.');
  console.log('61_getVideoList: event: ' + String(event));
  console.log('61_getVideoList: context: ' + String(context));
  
  // event에서 받아 오는 s3의 key는 저장된 파일이름으로 URL인코딩 되어있다. 사용하려면 URL디코딩 되어야 한다.
  //the input file may have spaces so replace them with '+'


  console.log('61_getVideoList: handler exit.');
};