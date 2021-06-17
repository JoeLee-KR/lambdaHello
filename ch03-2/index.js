/*
 * Step 11a. (3-2) 
 * 변환된 비디오 파일에 대해 URL로 공개적 접근이 되도록 권한 수정 Function
 * 몇 가지 IAM 관련 Case추가
 */

"use strict";

var AWS = require('aws-sdk');

// index.js로 만들어진 Function에서 Local Variable로 사용할 S3 Object생성
// 01_TransVideo01에서는 해당 자원에 대해 Region을 지정하였는데, 
// 01_setVideoPermission01에서는 S3자원에 대해 Region을 지정하지 않아도 되는지는 모르겠다.
// 책에는 없는 내용인데, region을 지정해 준다. 나중에 빼보고 진행하면 어떨지 테스트 필요...

// 특정 사용자 권한을 지정하려면, 아래 Credential을 사용하는 방식을 사용하면 된다.
// const myAccessKeyId = 'AKIAX3RSGUW25W2L7HMK';
// const mySecretAccessKey = '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';

// var s3 = new AWS.S3({
//    accessKeyId : myAccessKeyId,
//    secretAccessKey : mySecretAccessKey,
//    region: 'ap-northeast-1'
//});

// region을 지정하지 않는 경우는 아래와 같이 사용하면 된다.
//var s3 = new AWS.S3();

var s3 = new AWS.S3({
    region: 'ap-northeast-1'
});


exports.handler = function(event, context, callback){

    // S3의 Event에서 내용을 파악하는 것이 아니다. SNS에서 Event가 온다.
    // S3에서 SNS Topic으로 Event가 넘어오고, SNS Topic이 Subsciption으로 Event를 발생시킨다.
    // 따라서,SNS Subscription이 발생시킨 Event Object가 넘어 오므로 이 Object에서 내용물을 추출한다.
    var message = JSON.parse(event.Records[0].Sns.Message);

    var sourceBucket = message.Records[0].s3.bucket.name;
    var sourceKey = decodeURIComponent(message.Records[0].s3.object.key.replace(/\+/g, ' '));

    // 해당 Bucket & 해당 파일(key)에 대해 'public-read'권한을 지정한다.
    var params = {
        Bucket: sourceBucket,
        Key: sourceKey,
        ACL: 'public-read'
    };

    // 단순 log... ...
    console.log('01_setPermission01 : ');
    console.log('event message :' + message.message);
    console.log('source Bucket :' + sourceBucket);
    console.log('source key :' + sourceKey);

    // s3 Object에 params로 Bucket, Key(file)을 지정하고, 
    // ACL 내용을 지정한 다음, putObjectAcl method를 수횅하여 내용물 전달
    s3.putObjectAcl(params, function(err, data){
        console.log('ERR :', + err);
        if (err) {
            callback(err);
        }
    });
};