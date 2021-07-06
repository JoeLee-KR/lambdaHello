/**
 * Created by Peter Sbarski
 * Serverless Architectures on AWS
 * http://book.acloud.guru/
 * Last Updated: Feb 11, 2017
 */

'use strict';

var AWS = require('aws-sdk');
var exec = require('child_process').exec;
var fs = require('fs');
 
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
 
var s3 = new AWS.S3();
 
function saveMetadataToS3(body, bucket, key, callback){
    console.log('Saving metadata to s3');
 
    // S3에 body(넘어온 Stdout=Meta정보)를 저장함
    s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: body
    }, function(error, data){
        // error가 반환되면, callback return
        // error가 아닌 정상인 경우 및 funtion()을 통채로 S3.putObejct에 넘겨준 형태는 확인 필요
        if (error){
            console.log("Error: s3.putObject: " + bucket + ">" + key);
            callback(error);
        } else {
            console.log("OK: s3.putObject: " + bucket + ">" + key);
        }
    });
}
 
function extractMetadata(sourceBucket, sourceKey, localFilename, callback){
    console.log('Extracting metadata');
 
    // 아래의 ffprobe 명령을 Linux에서 직접사용하여, Test해 볼 필요가 있음
    var cmd = 'bin/ffprobe -v quiet -print_format json -show_format "/tmp/' + localFilename + '"';
 
    exec(cmd, function(error, stdout, stderr){
        if (error === null){
            console.log("OK: saveMeta s3.object: stdout is " + stdout);
            // 명령어 실행 결과에 문제가 없으면,
            // S3에 미디어파일명 + .json으로된 이름으로 결과(meta정보)를 Save하는 Function Call
            var metadataKey = sourceKey.split('.')[0] + '.json';
            console.log("OK: saveMeta s3.object: " + sourceBucket + ">" + sourceKey + "=" + metadataKey);
            saveMetadataToS3(stdout, sourceBucket, metadataKey, callback);
        } else {
            console.log("Error: extractMeta: " + stderr);
            callback(error);
        }
    });
}
 
function saveFileToLocalFilesystem(sourceBucket, sourceKey, callback){
    console.log('Saving to filesystem');
 
    var localFilename = sourceKey.split('/').pop();
    var file = fs.createWriteStream('/tmp/' + localFilename);
 
    // Bueckt-File을 S3에서 얻고, ReadStream을 만들고, ReadStream에 Pipe를 걸어준다.
    // Pipe의 destination은 앞에서 만들어준, Local에 동일 파일이름으로된 fs이다.
    var stream = s3.getObject({Bucket: sourceBucket, Key: sourceKey}).createReadStream().pipe(file);
 
    // stream.on 이라는 Method가 동시처리 개념인지, 
    // exclusive modal 처리인진는 애매함. 더 찾아 봐야함
    // 코드상으로는 stream은 처리되고 있고, 그 결과/상태를 확인하여
    // error이면, 그대로 callback으로 return 처리하고,
    // 정상완료 cloase이면, 다음 처리로 진행 
    stream.on('error', function(error){
        console.log('Error : Saving to filesystem: error');
        callback(error);
    });
 
    //This will become easier with async waterfall
    stream.on('close', function(){
        console.log('OK : call extractMeta with localfile : ' + localFilename);
        extractMetadata(sourceBucket, sourceKey, localFilename, callback);
    });
}
 

// lambda function 
exports.handler = function(event, context, callback){
    console.log('Enter Function : 01_extractMeta...');
    // S3에서 SNS Topic으로 Event가 넘어오고, SNS Topic이 Subsciption으로 Event를 발생시킨다.
    // 따라서,SNS Subscription이 발생시킨 Event Object가 넘어 오므로 이 Object에서 내용물을 추출한다.
    var message = JSON.parse(event.Records[0].Sns.Message);
    
    // Bucket과 대상 File 추출
    var sourceBucket = message.Records[0].s3.bucket.name;
    var sourceKey = decodeURIComponent(message.Records[0].s3.object.key.replace(/\+/g, ' '));
 
    console.log('call saveFileToLocal : ' + sourceBucket + ">" + sourceKey);
    saveFileToLocalFilesystem(sourceBucket, sourceKey, callback);
};
 