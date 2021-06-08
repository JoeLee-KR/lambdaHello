/*
 * Step 3. 트랜스코더에게 작업 생성의뢰
 * 사용할 트랜스코더의 파이프라인 ID를 알고 있어야 함
 */

'use strict';
var AWS = require('aws-sdk');

// region 선택을 확인한다.
var elasticTranscoder = new AWS.ElasticTranscoder({
    region: 'ap-northeast-1'
});


exports.handler = function(event, context, callback){
    console.log('Welcome');

    // event에서 받아 오는 s3의 key는 저장된 파일이름으로 URL인코딩 되어있다. 사용하려면 URL디코딩 되어야 한다.
    //the input file may have spaces so replace them with '+'
    var key = event.Records[0].s3.object.key;
    var sourceKey = decodeURIComponent(key.replace(/\+/g, ' '));

    //remove the extension
    var outputKey = sourceKey.split('.')[0];

    var params = {
        // PipelineId는 우리가 사용하기 위해 만들어놓은 것의 Id를 사용한다.
        // 아래 것은 ap-northeast-1에 하나 만들어 놓은 것이다.
        PipelineId: '1623120391203-6rqbho',
        Input: {
            Key: sourceKey
        },
        Outputs: [
            // 720p, 16:9 480p 만 테스트용으로 해 본다.
            /*
            {
                Key: outputKey + '-1080p' + '.mp4',
                PresetId: '1351620000001-000001' //Generic 1080p
            },
            */
            {
                Key: outputKey + '-720p' + '.mp4',
                PresetId: '1351620000001-000010' //Generic 720p
            },
            {
                Key: outputKey + '-480p169' + '.mp4',
                PresetId: '1351620000001-000010' //Generic 480p 16:9
            }
            /*
            {
                Key: outputKey + '-web-720p' + '.mp4',
                PresetId: '1351620000001-100070' //Web Friendly 720p
            }
            */
        ]};

    elasticTranscoder.createJob(params, function(error, data){
        if (error){
            callback(error);
        }
    });
};
